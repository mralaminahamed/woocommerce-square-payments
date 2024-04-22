/**
 * External dependencies.
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { useSquareSettings } from '../settings/hooks';
import { usePaymentGatewaySettings } from './hooks';
import {
	CashAppSetup,
	ConnectSetup,
	CreditCardSetup,
	DigitalWalletsSetup,
	GiftCardSetup,
	PaymentMethods,
	BusinessLocation,
	PaymentComplete,
} from './steps';
import { ConfigureSync, AdvancedSettings, SandboxSettings } from '../modules';

import { OnboardingHeader, PaymentGatewaySettingsSaveButton, SquareSettingsSaveButton } from '../components';

const paymentGatwaySettingsWithSaveButton = ( WrappedComponent ) => ( props ) => (
	<>
		<WrappedComponent { ...props } />
		<PaymentGatewaySettingsSaveButton setStep={props.setStep} nextStep={props.nextStep} />
	</>
);

const squareSettingsWithSaveButton = ( WrappedComponent ) => ( props ) => (
	<>
		<WrappedComponent { ...props } />
		<SquareSettingsSaveButton setStep={props.setStep} nextStep={props.nextStep} />
	</>
);

const WrapperCreditCardSetup = paymentGatwaySettingsWithSaveButton( CreditCardSetup );
const WrapperDigitalWalletsSetup = paymentGatwaySettingsWithSaveButton( DigitalWalletsSetup );
const WrapperGiftCardSetup = paymentGatwaySettingsWithSaveButton( GiftCardSetup );
const WrapperCashAppSetup = paymentGatwaySettingsWithSaveButton( CashAppSetup );
const WrapperConfigureSyncSetup = squareSettingsWithSaveButton( ConfigureSync );
const WrapperAdvancedSettings = squareSettingsWithSaveButton( AdvancedSettings );
const WrapperSandboxSettings = squareSettingsWithSaveButton( SandboxSettings );

export const OnboardingApp = () => {
	const [step, setStep] = useState( localStorage.getItem('step') || 'connect-square' );
	const [backStep, setBackStep] = useState( localStorage.getItem('backStep') || '' );
	const {
		settings,
	} = useSquareSettings( true );

	// Set info in local storage.
	useEffect(() => {
		localStorage.setItem('step', step);
		localStorage.setItem('backStep', backStep);
	}, [step, backStep]);

	// Set the backStep value.
	useEffect(() => {
		switch (step) {
			case 'connect-square':
			case 'business-location':
				setBackStep('');
				break;
			case 'payment-methods':
				setBackStep('business-location');
				break;
			case 'payment-complete':
				setBackStep('payment-methods');
				break;
			default:
				setBackStep('payment-complete');
				break;
		}
	}, [step]);

	// Calling this once to populate the data store.
	usePaymentGatewaySettings( true );

	if ( 'connect-square' === step && settings.is_connected ) {
		setStep('business-location');
	}

	return (
		<>
			<OnboardingHeader backStep={backStep} title={title} setStep={setStep} />
			<div className="woo-square-onboarding__cover">
				{ step === 'connect-square' && <ConnectSetup /> }
				{ step === 'business-location' && <BusinessLocation setStep={setStep} /> }
				{ step === 'payment-methods' && <PaymentMethods setStep={setStep} /> }
				{ step === 'payment-complete' && <PaymentComplete setStep={setStep} /> }
				{ step === 'credit-card' && <WrapperCreditCardSetup setStep={setStep} nextStep={'payment-complete'} /> }
				{ step === 'digital-wallets' && <WrapperDigitalWalletsSetup setStep={setStep} nextStep={'payment-complete'} /> }
				{ step === 'gift-card' && <WrapperGiftCardSetup setStep={setStep} nextStep={'payment-complete'} /> }
				{ step === 'cash-app' && <WrapperCashAppSetup setStep={setStep} nextStep={'payment-complete'} /> }
				{ step === 'sync-settings' && <WrapperConfigureSyncSetup setStep={setStep} nextStep={'payment-complete'} /> }
				{ step === 'advanced-settings' && <WrapperAdvancedSettings setStep={setStep} nextStep={'payment-complete'} /> }
				{ step === 'sandbox-settings' && <WrapperSandboxSettings setStep={setStep} nextStep={'payment-complete'} /> }
			</div>
		</>
	)
};
