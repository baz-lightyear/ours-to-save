import moment from 'moment'

const optimiseCloudinary = (url, width) => {
    if (/(.*)res.cloudinary(.*)$/.exec(url)) {
        return `${/(.*)upload\/(.*)$/.exec(url)[1]}upload/q_auto,f_auto,fl_lossy,w_${width}/${/(.*)upload\/(.*)$/.exec(url)[2]}`
    } else {
        return url
    }
}
const timeFromNow = (time) => {
    return moment(time).fromNow()
}

export { 
    optimiseCloudinary,
    timeFromNow
}