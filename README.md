# Example TAP3 Encoding and Decoding (Parser)

This repository demonstrates encoding and decoding of a simplified schema for TAP3 messages, simulating how a basic clearinghouse might process these files.

TAP (Transferred Account Procedure) files are part of the GSM Association's standard for inter-operator billing in the telecom industry. They contain call data records (CDRs) and other billing information that mobile operators use to settle charges for roaming services across networks. Each TAP file includes a structured header, a list of CDRs with detailed usage data, and a trailer with summary and control information. The format is based on ASN.1 (Abstract Syntax Notation One), ensuring data consistency and interoperability between different network operators globally.

In production, TAP files are often encrypted and transferred over secure channels to a clearinghouse or directly between operators, where the files are validated, decoded, and processed for billing. This helps streamline revenue sharing and billing accuracy for international and domestic roaming services.

In real-world telecom, a clearinghouse acts as an intermediary that:

- Validates and consolidates TAP3 files received from different operators.
- Calculates charges based on call duration, cost, and other factors.
- Ensures secure and transparent billing and reconciliation between operators.

In this demo, the clearing house is represented by file management in the messages folder. Once TAP3 files are decoded and processed, they are cleared out to indicate successful completion of billing data handling.

Notes: 
- the encoder and the decoder might(surely) contain duplicate code, for the simple reason of them being two different components in real life scenario.
- don't use this in production, this is just a dummy demo service, which is far off from production grade.

## Project Structure

- **`encoder.js`** - Encodes TAP3 files.
- **`decoder.js`** - Decodes the TAP3 files, converts them into readable objects.
- **`clearing-house.js`** - Generates random TAP3-encoded (to simulate receiving them) files with header, CDR, and trailer sections and clears them.
- **`messages/`** - Folder where the randomly generated TAP3 files are saved and processed.

## Usage

### Run the Clearing House

Run the `app.js` script to start generating sample TAP3 files every few seconds with random data in the `messages` folder. Same process will also pick them up and process them every 5 seconds.

```bash
npm run start
```

The generator will create files at random intervals (1-3 seconds) and encodes the TAP3 structure, including:

Header - Sender and receiver information.
CDRs - Call data records, including call type, duration, and cost.
Trailer - A summary section with total charge information.

This logs decoded file contents with readable information for each part of the TAP3 file, such as sender, receiver, call type, and duration.

### Manually clearing

Simply empties the existing messages on your fs.

```bash
npm run clear
```