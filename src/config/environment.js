export default function getUrl(){
    const currentENV = 'DEV';
    switch(currentENV){
        case 'DEV':
            return 'http://192.168.0.153:8080/dabdori-admin'
        case 'PROD':
            return 'http://admin.youngwoo.co/dabdori-admin'
    }

}