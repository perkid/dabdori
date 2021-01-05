export default function getUrl(){
    const currentENV = 'PROD';
    switch(currentENV){
        // case 'DEV':
        //     return 'http://172.20.10.2:8080/dabdori-admin'
        // case 'DEV':
        //     return 'http://172.30.1.12:8080/dabdori-admin'
        // case 'DEV':
        //     return 'http://210.120.6.28:80/dabdori-admin'
        case 'DEV':
            return 'http://192.168.1.210:8080/dabdori-admin'
        case 'PROD':
            return 'http://admin.youngwoo.co/dabdori-admin'
    }

}