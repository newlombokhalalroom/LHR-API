/* eslint-disable class-methods-use-this */

class EmailTemplates {
  constructor(
    ordersService,
    userDetailsService,
    clientDetailsService,
    orderItemsService,
  ) {
    this._ordersService = ordersService;
    this._userDetailsService = userDetailsService;
    this._clientDetailsService = clientDetailsService;
    this._orderItemsService = orderItemsService;
  }

  verificationCode(code) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
            }

            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }

            .header {
              text-align: center;
              background-color: #007bff;
              color: #ffffff;
              padding: 10px;
              border-radius: 5px 5px 0 0;
            }

            .content {
              padding: 20px;
              text-align: center;
            }

            .verification-code {
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              margin-top: 20px;
              padding: 10px;
              background-color: #007bff;
              color: #ffffff;
              border-radius: 5px;
            }
          </style>
        </head>

        <body>
          <div class="container">
            <div class="header">
              <h2>Email Verification Code</h2>
            </div>
            <div class="content">
              <img
                src="https://lombok-halal-room-api-jpeba.ondigitalocean.app/images/icon.png"
                alt="Lombok Halal Room Logo"
                width="150"
              />
              <p>This is your verification code. It will expire in 5 minutes.</p>
              <div class="verification-code">${code}</div>
            </div>
          </div>
        </body>
      </html>
      `;
  }

  resetPasswordCode(code) {
    return `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          background-color: #007bff;
          color: #ffffff;
          padding: 10px;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .verification-code {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin-top: 20px;
          padding: 10px;
          background-color: #007bff;
          color: #ffffff;
          border-radius: 5px;
        }
        .blue-button {
          background-color: #007bff;
          color: #fff;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          text-decoration: none;
        }
    
        .blue-button:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Change Password</h2>
        </div>
        <div class="content">
          <img
            src="https://lombok-halal-room-api-jpeba.ondigitalocean.app/images/icon.png"
            alt="Lombok Halal Room Logo"
            width="150"
          />
          <p>This is your verification code to reset password. It will expire in 5 minutes.</p>
          <div class="verification-code">${code}</div>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  async invoice(orderId) {
    const order = await this._ordersService.getInvoiceByOrderId(orderId);
    const userDetails = await this._userDetailsService.getUserDetailsById(order.user_details_id);
    const clientDetails = await this._clientDetailsService.getClientDetailsById(order.client_details_id);
    const orderItems = await this._orderItemsService.getInvoiceItems(orderId);
    const tableRows = orderItems.map((item) => `
      <tr>
        <td>${item.title}</td>
        <td>${item.description}</td>
        <td>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseFloat(item.price))}</td>
        <td>${item.quantity}</td>
        <td>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseFloat(item.price) * item.quantity)}</td>
      </tr>
    `).join('');

    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
          }
    
          .container {
            max-width: 960px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
    
          h2 {
            background-color: #007bff;
            color: #fff;
            text-align: center;
            padding: 10px;
            border-radius: 5px;
          }
    
          h3 {
            color: #007bff;
          }
    
          .row {
            margin-bottom: 20px;
          }
    
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
    
          th,
          td {
            padding: 10px;
            border: 1px solid #dee2e6;
          }
    
          th {
            background-color: #007bff;
            color: #fff;
          }
    
          .total-amount {
            text-align: right;
            font-size: 1.2em;
            font-weight: bold;
            margin-top: 20px;
          }
        </style>
      </head>
    
      <body class="p-3">
        <div class="container">
          <div class="row">
            <h2>Invoice</h2>
            <div class="col-md-6">
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p>
                <strong>Order Date:</strong> ${new Date(order._created_date).toLocaleDateString('en-US')}
              </p>
              <p>
                <strong>Start Date:</strong> ${new Date(order.start_date).toLocaleDateString('en-US')}
              </p>
              <p>
                <strong>End Date:</strong> ${new Date(order.end_date).toLocaleDateString('en-US')}
              </p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col-md-6">
              <h3>User Details</h3>
              <p><strong>Name:</strong> ${`${userDetails.first_name} ${userDetails.last_name}`}</p>
              <p><strong>Email:</strong> ${userDetails.email}</p>
              <p><strong>Phone:</strong> ${userDetails.phone}</p>
            </div>
            <div class="col-md-6">
              <h3>Client Details</h3>
              <p><strong>Name:</strong> ${clientDetails.name}</p>
              <p><strong>Email:</strong> ${clientDetails.email}</p>
              <p><strong>Phone:</strong> ${clientDetails.phone}</p>
              <p><strong>NPWP:</strong> ${clientDetails.npwp}</p>
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col-md-12">
              <h3>Order Items</h3>
              <table class="text-center">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 total-amount">Total Amount: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.total)}</div>
          </div>
        </div>
      </body>
    </html>
    `;
  }
}

module.exports = EmailTemplates;
