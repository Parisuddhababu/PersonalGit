## RAZORPAYMENT GATEWAY INTEGRATION

Razorpay is a popular payment gateway service that enables businesses to accept online payments
The purpose of integrating the Razorpay payment gateway into a web application, such as a React.js application.

### Purpose

- Online Payment Processing
  - Transaction Handling
- Diverse Payment Options
  - Multiple Payment Methods
- International Transactions
  - Global Transactions
- Subscription and Recurring Payments
  - Subscription Models
- Mobile Responsiveness
  - Mobile-Friendly
- Security and Compliance
  - PCI DSS Compliance
- Custom Checkout Experience
  - Customization
- Real-Time Transaction Analytics
- Developer-Friendly Integration
- Refund Management
- Invoicing and Billing
  - Invoicing Solutions
- Notifications and Alerts
  - Real-Time Notifications
- Comprehensive Dashboard
  - Merchant Dashboard

### Pre-Requisiting

- We need a order id from razorpay dashboard for this from backend we required a api that create a order on razorpay dashboard and that return a order key and we need to add that order key inside a `src/pages/index.tsx` file, replace `order_id: order_9A33XWu170gUtm` with current given order id from api.
- Need to purchase razorpay and that provided a payment key
- razorpay payment key format like this `XXX_XXXXXXXXXX`
- razorpay payment key and that key need to add in side a `src/pages/index.tsx` file, replace `YOUR_RAZOR_PAYMENT_KEY` with your purchased key

### Requirements

```
1. Node: v18.12.1
2. Npm: 8.19.2
```

### Usage

1.  Take clone of the code
2.  cd razorspay-paymentgateway-nextjs
3.  Install dependencies
    `npm install`
4.  Run the Project
    `npm run dev`
