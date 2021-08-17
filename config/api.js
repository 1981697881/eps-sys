/* const root = 'http://test.gzfzdev.com:5030'; */
const root = 'http://xsd.gzfzdev.com:50025/web';

/* const root = 'https://epssys.kuyuntech.com'; */
// const root = 'https://iyoze.utools.club';
// const root = 'https://epssyst.kuyuntech.com';
const api = {
	wxMaAuth: {
		login: root + '/wxMaAuth/login',
		phone: root + '/wxMaAuth/phone',
		receivingPay: root + '/wxMaAuth/receivingPay'
	},
	building: {
		tree: root + '/building/tree' 
	},
	deliveryTime: {
		weekdaysHolidayList: root + '/deliveryTime/weekdaysHolidayList'
	},
	common: {
		loadAreaChildren: root + '/common/loadAreaChildren',
		loadBusiness: root + '/common/loadBusiness',
		loadReceivingBusiness: root + '/common/loadReceivingBusiness',
		loadReceivingTimes: root + '/common/loadReceivingTimes',
	},
	member: {
		register: root + '/member/register',
		info: root + '/member/info',
		update: root + '/member/update',
	},
	memberCoupon: {
		list: root + '/memberCoupon/list'
	},
	deliveryRecord: {
		memberDeliveryList: root + '/deliveryRecord/memberDeliveryList',
		memberDeliveryDetail: root + '/deliveryRecord/memberDeliveryDetail',
		refuse: root + '/deliveryRecord/refuse'
	},
	receivingRecord: {
		order: root + '/receivingRecord/order',
		memberReceivingList: root + '/receivingRecord/memberReceivingList',
		detail: root + '/receivingRecord/detail',
		cancel: root + '/receivingRecord/cancel'
	},
	memberRefuseRecord: {
		list: root + '/memberRefuseRecord/list',
		add: root + '/memberRefuseRecord/add',
		delete: root + '/memberRefuseRecord/delete',
		update: root + '/memberRefuseRecord/update'
	}
}
export default Object.assign({
		$base: {
			root: root
		}
	},
	api
)
