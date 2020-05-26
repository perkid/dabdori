export default function getUrl(){
    const currentENV = 'PROD';
    switch(currentENV){
        case 'DEV':
            return 'http://192.168.0.82:8080/dabdori-admin'
        case 'PROD':
            return 'http://admin.youngwoo.co/dabdori-admin'
    }

}