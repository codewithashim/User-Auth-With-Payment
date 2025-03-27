/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - userId
 *         - amount
 *         - currency
 *         - gateway
 *         - paymentId
 *         - status
 *         - idempotencyKey
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the payment
 *         userId:
 *           type: string
 *           description: The ID of the user who initiated the payment
 *         amount:
 *           type: number
 *           description: The payment amount in cents
 *         currency:
 *           type: string
 *           description: The currency code (e.g., 'usd')
 *         gateway:
 *           type: string
 *           enum: [paypal, stripe]
 *           description: The payment gateway used
 *         paymentId:
 *           type: string
 *           description: The unique payment ID from the gateway (e.g., PayPal Order ID)
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *           description: The status of the payment
 *         idempotencyKey:
 *           type: string
 *           description: A unique key to prevent duplicate payments
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the payment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the payment was last updated
 *     CheckoutRequest:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         amount:
 *           type: number
 *           description: The payment amount in cents (minimum 100)
 *         currency:
 *           type: string
 *           description: The currency code
 *           default: 'usd'
 *     CheckoutResponse:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: The PayPal checkout URL
 *         payment:
 *           $ref: '#/components/schemas/Payment'
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         errorMessages:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *               message:
 *                 type: string
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     ForbiddenError:
 *       description: User does not have the necessary permissions
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     NotFoundError:
 *       description: The requested resource was not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management and processing
 */

/**
 * @swagger
 * /payments/checkout:
 *   post:
 *     summary: Create a PayPal checkout session
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutRequest'
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Checkout session created successfully
 *                 data:
 *                   $ref: '#/components/schemas/CheckoutResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Handle PayPal webhook events
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_type:
 *                 type: string
 *                 description: The type of webhook event (e.g., PAYMENT.CAPTURE.COMPLETED)
 *               resource:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The PayPal Order ID
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Webhook processed successfully
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Retrieve a list of payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         default: 10
 *         description: The number of items to return per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: The field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: The order to sort by
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term to filter payments
 *     responses:
 *       200:
 *         description: A list of payments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payments fetched successfully
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     total:
 *                       type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: The payment details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */