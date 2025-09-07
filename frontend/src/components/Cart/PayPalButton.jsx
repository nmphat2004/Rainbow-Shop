import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

const PayPalButton = ({ amount, onSuccess, onError }) => {
	return (
		<PayPalScriptProvider
			options={{
				clientId:
					'AZB7ZZci06pCvCLhQH9XqBqmvmDwwXoQP6GkKoeZ5JFES6-P6ShiGY4f7mSmj-AgYdcXnxfxoJ2a89yd',
			}}>
			<PayPalButtons
				style={{ layout: 'vertical' }}
				createOrder={(data, actions) => {
					return actions.order.create({
						purchase_units: [{ amount: { value: amount } }],
					});
				}}
				onApprove={(data, actions) => {
					return actions.order.capture().then(onSuccess);
				}}
				onError={onError}></PayPalButtons>
		</PayPalScriptProvider>
	);
};
export default PayPalButton;
