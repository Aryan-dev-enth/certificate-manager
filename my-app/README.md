# Certificate Manager

A professional Next.js application for managing college certificate records with MongoDB integration.

## Features

- **Authentication System**: Email/password login for club accounts with super-admin privileges
- **Multi-step CSV Upload**: Parse, preview, filter, and confirm certificate uploads
- **Certificate Viewer**: Full table view with advanced filtering and pagination
- **Dashboard**: Summary statistics with charts and recent batch tracking
- **Export Functionality**: CSV export with filtering options
- **Audit Logging**: Complete audit trail for all operations
- **Responsive Design**: Professional, corporate-style UI that works on all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, MongoDB with native driver
- **UI**: Tailwind CSS, Radix UI components, Recharts for data visualization
- **Authentication**: JWT-based authentication with secure cookies
- **File Processing**: Papa Parse for CSV handling

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Update the following variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret key for JWT tokens

4. Configure the application:
   - Edit `lib/config.ts` to set:
     - Super admin email
     - Allowed club account emails
     - Export field configuration

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Initial Setup

1. Create user accounts by running the setup script or manually inserting users into the database
2. The super admin account (configured in `lib/config.ts`) has delete privileges for batches
3. Club accounts can upload and view certificates but cannot delete batches

## Usage

### Uploading Certificates

1. Navigate to "Upload Certificates"
2. Select a CSV file with required columns: `CertificateNo`, `Name`, `RollNo`, `Event`, `Date`
3. Preview the data and apply filters if needed
4. Confirm the upload to save to database

### Viewing Certificates

1. Navigate to "View Certificates"
2. Use filters to search specific records
3. Export filtered or all data to CSV
4. Paginate through large datasets

### Dashboard

- View summary statistics
- Monitor recent upload batches
- Visualize data with charts
- Super admins can delete batches

## Database Collections

- **certificates**: Individual certificate records
- **uploads**: Batch metadata with soft deletion
- **auditLogs**: Complete audit trail
- **users**: User accounts and authentication

## Configuration

Key configuration options in `lib/config.ts`:

- `SUPER_ADMIN_EMAIL`: Email with delete privileges
- `ALLOWED_ACCOUNTS`: List of permitted login emails
- `EXPORT_FIELDS`: CSV export column configuration
- `ROWS_PER_PAGE`: Pagination settings

## Security Features

- JWT-based authentication
- Role-based access control
- Audit logging for all operations
- Input validation and sanitization
- Secure password hashing with bcrypt

## License

This project is licensed under the MIT License.
