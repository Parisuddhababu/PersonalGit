import React from 'react';
import { useTranslation } from 'react-i18next';

const SmartComposters = () => {
	const { t } = useTranslation();
	
	return (
		<div>
            {t('Smart Composters Page Incomming!!!')}
		</div>
	);
};
export default SmartComposters;
