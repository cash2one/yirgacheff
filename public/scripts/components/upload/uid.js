//上传id,每一个上传实例都有一个uid
const now = +(new Date());
let index = 0;
export default function uid() {
	return 'vue-upload-' + now + '-' + (++index);
};