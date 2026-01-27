# Prompt for AI Developer: Build the Talk2Nebiah Website

## 1. Project Overview

You are tasked with developing a professional, modern, and responsive one-page website for **Talk2Nebiah**.

**Talk2Nebiah** is a safe space for real conversations about real struggles. The platform addresses topics like stress, anxiety, depression, postpartum challenges, and emotional burnout. The target audience includes anyone seeking a supportive community to discuss mental health challenges, from teenagers to adults. The website's tone should be honest, judgment-free, practical, and hopeful.

## 2. Core Objectives

- **Develop a one-page website** with a clear and intuitive structure.
- **Implement a modern and calming design** that reflects the brand's identity.
- **Ensure the website is fully responsive** and accessible on all devices (desktops, tablets, and mobiles).
- **Integrate the provided content** for each section.
- **Create a placeholder section** for a future payment integration.

## 3. Technology Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS (the project is already set up with `postcss.config.mjs`)

## 4. Design and Style Guide

- **Color Palette:** The primary color scheme is **mint green** and **white**. Use these colors to create a clean, fresh, and calming aesthetic.
    - **Mint Green:** For backgrounds, accents, and buttons.
    - **White:** For text on dark backgrounds and for main background areas to create a sense of space.
    - **Gray:** Use light and dark grays for text and secondary elements.
- **Typography:** Choose a clean, modern, and highly readable sans-serif font (e.g., Inter, Lato, or similar).
- **Overall Feel:** The design should be minimalist, spacious, and professional.

## 5. Website Structure (One-Page Layout)

The website should be a single page with vertical scrolling. The header navigation links should smoothly scroll to the corresponding sections.

### a. Header (`<Header>`)
- **Logo/Brand Name:** "Talk2Nebiah" on the left.
- **Navigation:** "About", "Services", "Contact" on the right. These should be anchor links.
- The header should be sticky or become visible when scrolling up.

### b. Hero Section (`<Hero>`)
- This is the first thing users see. It should be impactful.
- Use a mint green background with white text.
- **Content:**
    ```
    # Welcome to Talk2Nebiah
    **A safe space for real conversations about real struggles.**

    Life can be overwhelming. The pressures of work, school, relationships, and social media can take a toll on our mental well-being. At Talk2Nebiah, we understand. We provide a supportive community where you can openly share your experiences with stress, anxiety, depression, and other life challenges without fear of judgment.

    You are not alone. We are here to listen, to support, and to help you find your way back to a place of peace and clarity.

    **It's okay not to be okay. Let's talk.**
    ```
- **Call to Action Button:** A button that says "Let's Talk" which scrolls to the Contact section.

### c. About Us Section (`<About>`)
- A section with a white background.
- **Content:**
    ```
    # About Talk2Nebiah

    Talk2Nebiah was founded on a simple but powerful belief: no one should have to suffer in silence. Mental health is a universal human experience, affecting everyone from children to adults. The quiet battles people fight every day are real, and they deserve to be heard.

    Our mission is to break the stigma surrounding mental health by creating a space for honest, judgment-free conversations. We are not about clinical diagnoses or prescriptions. We are about shared human experiences, practical coping mechanisms, and the power of community.

    We believe that through talking, healing, unlearning, and growing, we can find hope and strength together. This is a space to breathe again, think clearly, and rediscover your inner resilience.
    ```

### d. Services Section (`<Services>`)
- A section with a light gray or very light mint green background to differentiate it.
- Use a card-based layout to present the three services.
- **Content:**
    ```
    # Our Services

    At Talk2Nebiah, we offer a range of services designed to provide practical support and guidance on your mental wellness journey.

    ### One-on-One Peer Support
    Connect with a trained peer support listener who can offer a compassionate ear and share their own experiences. These are not therapy sessions, but confidential conversations aimed at providing comfort and perspective.

    ### Group Support Sessions
    Join our themed group discussions on topics like managing anxiety, coping with burnout, and navigating life transitions. Share and learn from others who are on a similar path.

    ### Workshops & Resources
    We offer workshops and a library of resources on topics such as mindfulness, stress-reduction techniques, and building healthy habits. Our goal is to empower you with practical tools to support your mental well-being.

    *Please note: Our services are designed for peer support and are not a substitute for professional medical advice, diagnosis, or treatment. If you are in crisis, please contact a mental health professional or a crisis hotline.*
    ```

### e. Payment Section (`<Payment>`)
- This is a placeholder for a future **Paystack** integration.
- Design a simple, clear section that encourages donations.
- Use a mint green background with white text.
- **Content:**
    - **Headline:** "Support Our Mission"
    - **Text:** "Your contribution helps us keep this space safe and accessible to everyone."
    - **Button:** A "Donate Now" button. For now, this button does not need to have any functionality.

### f. Contact Section (`<Contact>`)
- A section with a white background.
- **Content:**
    ```
    # Get in Touch

    We're here for you. Whether you have a question, need someone to talk to, or want to learn more about our services, please don't hesitate to reach out.

    **Email:** hello@talk2nebiah.com

    **Follow us on social media:**
    *   **Instagram:** @talk2nebiah
    *   **Twitter:** @talk2nebiah
    *   **Facebook:** /talk2nebiah

    For partnerships and media inquiries, please contact us at partnerships@talk2nebiah.com.
    ```

### g. Footer (`<Footer>`)
- A dark gray or black background with white text.
- **Content:**
    - Copyright notice: `&copy; {current_year} Talk2Nebiah. All rights reserved.`
    - Social media links (Instagram, Twitter, Facebook).

## 6. Implementation Details

- Create a `src/components` directory.
- For each section listed above (Header, Hero, About, etc.), create a separate React component file in `src/components`.
- Assemble these components in the main `src/app/page.tsx` file to form the one-page layout.
- Use Tailwind CSS for all styling. Define the mint green color in your `tailwind.config.js` file for easy reuse.

## 7. Deliverables

1.  A fully coded, one-page website based on the specifications above.
2.  All code should be in TypeScript and use React components within a Next.js project.
3.  The website must be responsive and styled according to the design guide.
4.  The final output should be a clean, well-structured, and commented codebase.
