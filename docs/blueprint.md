# **App Name**: AVA Mobile

## Core Features:

- Bank Transfer Simulation: Simulate mobile bank transfers, including realistic error scenarios and success paths.
- Form Input: Collect beneficiary, bank details, and amount using input fields and dropdowns.
- Error Simulation: Randomly generate bank/SPEI errors, such as bank downtime, security holds, or CLABE mismatches.
- Simulated Requirement Checks: Simulate payment checks for honorarios, apertura de folio, and fianza de protección.
- Success Scenario: Generate a transfer success message with a simulated folio number.
- PDF Receipt Generation: Generate a PDF receipt using jsPDF with transfer details.
- Transfer Saving: Allow the option to save a transfer to Firestore

## Style Guidelines:

- Primary color: Azul corporativo (#003366) to evoke trust and security, aligning with financial services.
- Azul claro (#0A84FF) for interactive elements.
- Gris (#F5F5F7) for background.
- Verde éxito (#2ECC71), for success messages.
- Rojo error (#E74C3C) for error messages.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a neutral look; suitable for headlines or body text
- Use simple, minimalist icons for navigation and status indicators.
- Mobile-first, single-column layout for ease of use on smaller screens. Utilize clear sections for each step of the transfer process.
- Subtle loading animations during processing and verification steps.