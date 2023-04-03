const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;

const definition = {
    zigbeeModel: ['LM-SZ4'], // The model ID from: Device with modelID 'lumi.sens' is not supported.
    model: 'LUMI', // Vendor model number, look on the device for a model number
    vendor: 'Lumi', // Vendor of the device (only used for documentation and startup logging)
    description: 'Cong tac Lumi 4CH', // Description of the device, copy from vendor site. (only used for documentation and startup logging)
	extend: extend.switch(),
    exposes: [e.switch().withEndpoint('1').setAccess('state', ea.STATE_SET),
	e.switch().withEndpoint('3').setAccess('state', ea.STATE_SET),
	e.switch().withEndpoint('5').setAccess('state', ea.STATE_SET),
	e.switch().withEndpoint('7').setAccess('state', ea.STATE_SET),
	fromZigbee: [fz.tuya_switch, fz.ignore_time_read],
	toZigbee: [tz.tuya_switch_state],
	meta: {multiEndpoint: true},
	endpoint: (device) => {
	// Endpoint selection is made in tuya_switch_state
	return {'l': 1, '3': 1, '5': 1, '7': 1};
    // The configure method below is needed to make the device reports on/off state changes
    // when the device is controlled manually through the button on it.
    configure: async (device, coordinatorEndpoint, logger) => {
        const endpoint = device.getEndpoint(1);
        await reporting.bind(endpoint, coordinatorEndpoint, ['genOnOff']);
        await reporting.onOff(endpoint);
    },
};

module.exports = definition;