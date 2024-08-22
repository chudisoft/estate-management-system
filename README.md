# Estate Management System

## Overview

The Estate Management System is a web application designed for managing apartments, buildings, rents, expenses, users, and payments. It uses Next.js for the frontend, Prisma for database management, and SQLite as the database. The project includes CRUD operations for each resource, with API documentation generated using Swagger.

## Features

- **Apartments**: Manage apartment listings, including creating, updating, and deleting records.
- **Buildings**: Manage building information.
- **Rent**: Track and manage rent payments.
- **Expenses**: Record and manage expenses related to the estate.
- **Users**: Manage user accounts with authentication.
- **Payments**: Track payment records and methods.
- **Auth**: Uses role-based authentication and authorization with google auth.

## Technologies

- **Frontend**: Next.js
- **Backend**: Next.js API routes
- **Database**: SQLite (via Prisma)
- **Documentation**: Swagger
- **TypeScript**: Used for type safety and better development experience

## API Documentation

API documentation is available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs) and is generated using Swagger. Ensure that the Swagger setup is correctly pointing to your API routes.

## API Routes

### Apartments: `/api/apartments`

- **GET**: Retrieve all apartments
- **POST**: Create a new apartment
- **PUT**: Update an existing apartment
- **DELETE**: Delete an apartment

### Buildings: `/api/buildings`

- **GET**: Retrieve all buildings
- **POST**: Create a new building
- **PUT**: Update an existing building
- **DELETE**: Delete a building

### Rent: `/api/rent`

- **GET**: Retrieve all rent records
- **POST**: Create a new rent record
- **PUT**: Update an existing rent record
- **DELETE**: Delete a rent record

### Expenses: `/api/expenses`

- **GET**: Retrieve all expenses
- **POST**: Create a new expense
- **PUT**: Update an existing expense
- **DELETE**: Delete an expense

### Users: `/api/users`

- **GET**: Retrieve all users
- **POST**: Create a new user
- **PUT**: Update an existing user
- **DELETE**: Delete a user

### Payments: `/api/payments`

- **GET**: Retrieve all payments
- **POST**: Create a new payment record
- **PUT**: Update an existing payment record
- **DELETE**: Delete a payment record

## Contributing

1. **Fork the repository**
2. **Create a new branch** (`git checkout -b feature-branch`)
3. **Make your changes**
4. **Commit your changes** (`git commit -am 'Add new feature'`)
5. **Push to the branch** (`git push origin feature-branch`)
6. **Create a new Pull Request**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, please contact:

- **Uduekwe Christopher** - [christopheruduekwe@gmail.com](mailto:christopheruduekwe@gmail.com)


## Installation

1. **Clone the repository:**

```
   git clone https://github.com/your-username/estate-management-system.git
   cd estate-management-system
```

## Getting Started

First, run the development server:

```
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
