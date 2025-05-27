export const options = [
    {
        name: 'Jamii Telkom',
        inputs: [
            {
                type: 'selectbox',
                name: 'destination',
                reuired: true,
                value: '',
                options: [
                    { label: 'Nairobi', value: 'nairobi' },
                    { label: 'Mombasa', value: 'mombasa' },
                ],
            },
            {
                type: 'text',
                name: 'Full Name',
                value: '',
            },
            {
                type: 'numeric',
                name: 'Phone Number',
                required: true,
                value: '',
            }
        ],
        // imageUrl: require('../../assets/access/jtl.png'),
    },
    {
        name: 'Telkom PostPaid',
        inputs: [
            {
                type: 'selectbox',
                name: 'destination',
                value: '',
                required: true,
                options: [
                    { label: 'Nairobi', value: 'nairobi' },
                    { label: 'Mombasa', value: 'mombasa' },
                ],
            },
            {
                type: 'text',
                name: 'Full Name',
                value: '',
                required: true,
            },
            {
                type: 'numeric',
                name: 'Phone Number',
                value: '',
                required: true,
            },
        ],
        // imageUrl: require('../../assets/access/telcom.jpg'),
    },
    {
        name: 'Airtel PostPaid',
        inputs: [],
        // imageUrl: require('../../assets/access/airtel.png'),
    },
    {
        name: 'iTax',
        inputs: [
            {
                type: 'selectbox',
                name: 'Tax Type',
                value: '',
                required: true,
                options: [
                    { label: 'Domestic', value: 'domestic' },
                    { label: 'Non-domestic', value: 'non-domestic' },
                ],
            },
            {
                type: 'text',
                name: 'PIN',
                value: '',
                required: true,
            },
            {
                type: 'numeric',
                name: 'Tax Amount',
                value: '',
                required: true,
            },
        ],
        // imageUrl: require('../../assets/access/itax.png'),
    },
    {
        name: 'PesaLink To Phone',
        inputs: [
            {
                type: 'selectbox',
                name: 'Bank',
                value: '',
                required: true,
                options: [
                    { label: 'Bank A', value: 'bank_a' },
                    { label: 'Bank B', value: 'bank_b' },
                ],
            },
            {
                type: 'text',
                name: 'Phone Number',
                value: '',
                required: true,
            },
            {
                type: 'text',
                name: 'Full Name',
                value: '',
                required: true,
            },
            {
                type: 'numeric',
                name: 'Amount',
                value: '',
                required: true,
            },
        ],
        // imageUrl: require('../../assets/access/pesalinktophone.jpg'),
    },
    {
        name: 'PesaLink To Account',
        inputs: [{
            type: 'selectbox',
            name: 'Bank',
            value: '',
            required: true,
            options: [
                { label: 'Bank A', value: 'bank_a' },
                { label: 'Bank B', value: 'bank_b' },
            ],
        },
        {
            type: 'text',
            name: 'Account Number',
            value: '',
            required: true,
        },
        {
            type: 'numeric',
            name: 'Amount',
            value: '',
            required: true,
        }],
        // imageUrl: require('../../assets/access/pesalink.jpg'),
    },
    {
        name: 'Bankers Cheque',
        inputs: [{
            type: 'selectbox',
            name: 'Account Type',
            value: '',
            required: true,
            options: [
                { label: 'Savings Account', value: 'savings' },
                { label: 'Current Account', value: 'current' },
                { label: 'Fixed Deposit', value: 'fixed_deposit' },
            ],
        }],
        // imageUrl: require('../../assets/access/check.jpg'),
    },
    {
        name: 'ChequeBook Request',
        inputs: [{
            type: 'selectbox',
            name: 'Account Type',
            value: '',
            required: true,
            options: [
                { label: 'Savings Account', value: 'savings' },
                { label: 'Current Account', value: 'current' },
                { label: 'Fixed Deposit', value: 'fixed_deposit' },
            ],
        }],
        // imageUrl: require('../../assets/access/checkbook.jpg'),
    },
    {
        name: 'Full Statement',
        inputs: [{
            type: 'selectbox',
            name: 'Account Type',
            value: '',
            required: true,
            options: [
                { label: 'Savings Account', value: 'savings' },
                { label: 'Current Account', value: 'current' },
                { label: 'Fixed Deposit', value: 'fixed_deposit' },
            ],
        }],
        // imageUrl: require('../../assets/access/statement.png'),
    },
    {
        name: 'Settings',
        inputs: [],
        // imageUrl: require('../../assets/access/settings.png'),
    },
    {
        name: 'EXPRESSWAY Payment',
        inputs: [{
            type: 'selectbox',
            name: 'Toll Type',
            value: '',
            required: true,
            options: [
                { label: 'Motorcycle', value: 'motorcycle' },
                { label: 'Car', value: 'car' },
                { label: 'Bus', value: 'bus' },
                { label: 'Truck', value: 'truck' },
            ],
        }],
        // imageUrl: require('../../assets/access/expressway.jpg'),
    },
    {
        name: 'Unit Trust',
        inputs: [{
            type: 'selectbox',
            name: 'Fund Type',
            value: '',
            required: true,
            options: [
                { label: 'Equity Fund', value: 'equity' },
                { label: 'Money Market Fund', value: 'money_market' },
                { label: 'Balanced Fund', value: 'balanced' },
            ],
        }],
        // imageUrl: require('../../assets/access/unittrust.jpg'),
    },
    {
        name: 'My Cards',
        inputs: [{
            type: 'selectbox',
            name: 'Card Type',
            value: '',
            required: true,
            options: [
                { label: 'Debit Card', value: 'debit' },
                { label: 'Credit Card', value: 'credit' },
                { label: 'Prepaid Card', value: 'prepaid' },
            ],
        }],
        // imageUrl: require('../../assets/access/cards.jpg'),
    },
    {
        name: 'Mpesa to Account',
        inputs: [{
            type: 'selectbox',
            name: 'Bank',
            value: '',
            required: true,
            options: [
                { label: 'Bank A', value: 'bank_a' },
                { label: 'Bank B', value: 'bank_b' },
            ],
        },
        {
            type: 'text',
            name: 'Account Number',
            value: '',
            required: true,
        },
        {
            type: 'numeric',
            name: 'Amount',
            value: '',
            required: true,
        }],
        // imageUrl: require('../../assets/access/mpesatoacc.png'),
    },
    {
        name: 'Insurance',
        inputs: [{
            type: 'selectbox',
            name: 'Insurance Type',
            value: '',
            required: true,
            options: [
                { label: 'Health Insurance', value: 'health' },
                { label: 'Motor Insurance', value: 'motor' },
                { label: 'Life Insurance', value: 'life' },
            ],
        }],
        // imageUrl: require('../../assets/access/insurance.jpg'),
    },
    {
        name: 'eCitizen',
        inputs: [{
            type: 'selectbox',
            name: 'Service Type',
            value: '',
            required: true,
            options: [
                { label: 'Business Registration', value: 'business_registration' },
                { label: 'Passport Application', value: 'passport_application' },
                { label: 'Driving License', value: 'driving_license' },
            ],
        }],
        // imageUrl: require('../../assets/access/ecitizen.png'),
    },
];