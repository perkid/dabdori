import { Keyboard } from 'react-native';
import { callNumber } from './calling';
import axios from 'axios';
import getUrl from '../config/environment';

function createMessage(text, option, subOption, item, userInfo, company, messageSend, handleOption, handleSubOption, handleItem, selectCompany, handleCompany, sendPushNotification, handleColor, color, handleItemName, itemName, handlePrice, price, scroll) {
    let message;
    let quick;

    const url = getUrl();

    // userInfo.role='client'
    // userInfo.specGB='Y'
    // userInfo.priceGB='Y'

    if (userInfo.role !== 'employee') {
        handleCompany([{
            custName: userInfo.company_name,
            custCode: userInfo.company_code
        }])
    }

    function toCommaStringF( number ) {
         var number_string = number
         var number_parts = number_string.split('.'); 
         var regexp = /\B(?=(\d{3})+(?!\d))/g; 
         if (number_parts.length > 1) { 
             return number_parts[0].replace( regexp, ',' ) + '.' + number_parts[1]; 
        } else { 
            return number_string.replace( regexp, ',' );
         } 
    }

    const blank_pattern = /[\s]/g;

    const create = (text, option, subOption, quick, item, list, company) => {
        let quickReplies;

        if (quick === 1) {
            quickReplies = {
                type: 'radio',
                values: [
                    {
                        title: '현물조회',
                        value: '현물조회',
                    },
                    {
                        title: '샘플신청',
                        value: '샘플신청',
                    },
                    {
                        title: '아이템 정보',
                        value: '아이템 정보',
                    },
                    // {
                    //     title: '푸시 테스트',
                    //     value: '푸시 테스트'
                    // }
                ],
            }
        }
        if (quick === 2) {
            quickReplies = {
                type: 'radio',
                values: [
                    {
                        title: '업차지',
                        value: '업차지',
                    },
                    {
                        title: '스펙과 단가',
                        value: '스펙과 단가',
                    },
                    {
                        title: '처음 단계로',
                        value: '처음 단계로',
                    },
                ],
            }
        }
        if (quick === 3) {
            quickReplies = {
                type: 'radio',
                values: [
                    {
                        title: '매장',
                        value: '매장',
                    },
                    {
                        title: '영업사원전달',
                        value: '영업사원전달',
                    }
                ],
            }
        }
        if (quick === 4) {
            quickReplies = {
                type: 'radio',
                values: [
                    {
                        title: '네, 주문완료',
                        value: '주문완료',
                    },
                    {
                        title: '네, 전달사항 추가',
                        value: '전달사항추가',
                    },
                    {
                        title: '아니요, 다시입력',
                        value: '다시입력',
                    }
                ],
            }
        }
        if (quick === 5) {
            quickReplies = {
                type: 'radio',
                values: [
                    {
                        title: '업체용',
                        value: '업체용',
                    },
                    {
                        title: '직원용',
                        value: '직원용'
                    }
                ]
            }
        }
        if (quick === 6) {
            quickReplies = {
                type: 'radio',
                values: [
                    {
                        title: '네',
                        value: '네',
                    },
                    {
                        title: '아니요',
                        value: '아니요',
                    }
                ]
            }
        }
        if (quick === 7) {
            quickReplies = {
                type: 'radio',
                values: [
                    {
                        title: '빠른수배 요청',
                        value: '빠른수배 요청',
                    },
                    {
                        title: '샘플신청',
                        value: '샘플신청',
                    },
                    {
                        title: '처음 단계로',
                        value: '처음 단계로',
                    }
                ]
            }
        }
        message = {
            createdAt: new Date(),
            _id: Math.round(Math.random() * 1000000),
            text: text,
            user: {
                _id: 2
            },
            quickReplies,
            option: option,
            subOption: subOption,
            item: item,
            list: list,
            company: company,
        }
    }

    // if(option===0 && base.indexOf(text)===-1){
    //     text = `잘못 입력 하셨습니다. 다시 입력 해주세요.`
    //         option = 0;
    //         subOption = 0;
    //         quick = 1
    //         create(text, option, subOption, quick);
    // }
    // 현물조회
    if (text === '현물조회') {
        if (userInfo.role === 'employee') {
            text = `아이템명(또는 아이템 번호)과\n칼라번호 입력\n\n예) ${userInfo.promotion_Item}\n${userInfo.promotion_Color}\n\n(전체 칼라를 원할 경우 아이템\n명만 입력)`;
            option = 1;
            subOption = 1;
            create(text, option, subOption);
        }
        if (userInfo.role === 'client'||userInfo.role==='partner') {
            text = `아이템명(또는 아이템번호) 조\n회 후 칼라번호 조회\n예) ${userInfo.promotion_Item}`;
            option = 1;
            subOption = 4;
            create(text, option, subOption);
        }
    }

    if (option === 1 && subOption === 1 && text.length < 15) {
        let strArr = text.split(' ');
        //아이템 명만 입력한 경우
        if (strArr.length === 1) {
            axios.post(url + '/api/currentInventory.dab',
            {
                    itemName: strArr[0],
                    includeYN: 0
            }).then((response)=>{
                if(response.data.length===0){
                    text = `${strArr[0]}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`
                    handleOption(1)
                    handleSubOption(1)
                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        option: 1,
                        subOption: 1,
                    }
                    messageSend(message)
                } else {
                    text = `용도를 선택해 주세요.`;
                    handleOption(1)
                    handleSubOption(2)
                    handleItem(strArr[0])
                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        quickReplies : {
                            type: 'radio',
                            values: [
                                {
                                    title: '업체용',
                                    value: '업체용',
                                },
                                {
                                    title: '직원용',
                                    value: '직원용'
                                }
                            ]
                        },
                        option: 1,
                        subOption: 2,
                    }
                    messageSend(message)
                    Keyboard.dismiss()
                }
            }).catch((err)=>{
                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                    handleOption(0)
                    handleSubOption(0);
                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        quickReplies : {
                            type: 'radio',
                            values: [
                                {
                                    title: '현물조회',
                                    value: '현물조회',
                                },
                                {
                                    title: '샘플신청',
                                    value: '샘플신청',
                                },
                                {
                                    title: '아이템 정보',
                                    value: '아이템 정보',
                                },
                            ],
                        },
                        option: 0,
                        subOption: 0,
                    }
                    messageSend(message)
            })
        }
        //칼라 번호도 입력한 경우
        if (strArr.length === 2) {
            axios.post(url + '/api/currentInventory.dab',
                {
                        itemName: strArr[0],
                        colorYW: strArr[1],
                        includeYN: 1
                }).then((resoponse) => {
                    let r = resoponse.data[0];
                    if(r!==undefined){
                        axios.post(url + `/api/currentLotInventory.dab`,
                    {
                        itemName: strArr[0],
                        colorYW: strArr[1]
                    }).then((res)=>{
                        let ipjulCnt = res.data.ipjulCnt;
                        let maxQty = res.data.maxQty;
                        if (r !== undefined) {
                            axios.post(url + `/api/productionQuantity.dab`,{
                                itemCode: res.data.itemCode,
                                colorNo: res.data.colorNo
                            }).then((res)=>{
                                handleOption(0)
                                handleSubOption(0)
                                if(res.data.length===0){
                                    message = {
                                        createdAt: new Date(),
                                        _id: Math.round(Math.random() * 1000000),
                                        text: `${r.itemname} ${r.coloryw}\n(${r.colorname})\n\n현물 ${r.jaeqty}YD\n한롯트 가능수량 ${maxQty}YD (${ipjulCnt}절)`,
                                        user: {
                                            _id: 2
                                        },
                                        quickReplies: {
                                            type: 'radio',
                                            values: [
                                                {
                                                    title: '현물조회',
                                                    value: '현물조회',
                                                },
                                                {
                                                    title: '샘플신청',
                                                    value: '샘플신청',
                                                },
                                                {
                                                    title: '아이템 정보',
                                                    value: '아이템 정보',
                                                },
                                            ],
                                        },
                                        option: 0,
                                        subOption: 0,
                                    }
                                }
                                if(res.data.length>0){
                                    let pqty = '';
                                    for (let i = 0; i < res.data.length; i++) {
                                        pqty += `${res.data[i].qty}${res.data[i].unit} (${res.data[i].delyDate})`;
                                        if(i!==res.data.length-1){
                                            pqty += `\n`;
                                        }
                                    }
                                    message = {
                                        createdAt: new Date(),
                                        _id: Math.round(Math.random() * 1000000),
                                        text: `${r.itemname} ${r.coloryw}\n(${r.colorname})\n\n현물 ${r.jaeqty}YD\n한롯트 가능수량 ${maxQty}YD (${ipjulCnt}절)\n\n생산예비수량\n${pqty}`,
                                        user: {
                                            _id: 2
                                        },
                                        quickReplies: {
                                            type: 'radio',
                                            values: [
                                                {
                                                    title: '현물조회',
                                                    value: '현물조회',
                                                },
                                                {
                                                    title: '샘플신청',
                                                    value: '샘플신청',
                                                },
                                                {
                                                    title: '아이템 정보',
                                                    value: '아이템 정보',
                                                },
                                            ],
                                        },
                                        option: 0,
                                        subOption: 0,
                                    }
                                }
                                messageSend(message)
                                //로그입력
                                axios.post(url+`/api/insertLog.dab`,{
                                    log_gb:'01',
                                    item_code:r.itemcode,
                                    item_name:r.itemname,
                                    color_name:r.coloryw,
                                    hq_cnt:r.jaeqty,
                                    deagu_cnt:r.gayoungqty,
                                    prod_cnt:r.productqty,
                                    hold_cnt:r.holdqty,
                                    user_name:userInfo.user_name,
                                    role: userInfo.role,
                                    cust_name:userInfo.company_name,
                                })
                            }).catch((err)=>{
                                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                                handleOption(1)
                                handleSubOption(1);
                                message = {
                                    createdAt: new Date(),
                                    _id: Math.round(Math.random() * 1000000),
                                    text: text,
                                    user: {
                                        _id: 2
                                    },
                                    quickReplies : {
                                        type: 'radio',
                                        values: [
                                            {
                                                title: '현물조회',
                                                value: '현물조회',
                                            },
                                            {
                                                title: '샘플신청',
                                                value: '샘플신청',
                                            },
                                            {
                                                title: '아이템 정보',
                                                value: '아이템 정보',
                                            },
                                        ],
                                    },
                                    option: 0,
                                    subOption: 0,
                                }
                                messageSend(message)
                            })
                        }
                    }).catch((err)=>{
                        text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                        handleOption(1)
                        handleSubOption(1);
                        message = {
                            createdAt: new Date(),
                            _id: Math.round(Math.random() * 1000000),
                            text: text,
                            user: {
                                _id: 2
                            },
                            quickReplies : {
                                type: 'radio',
                                values: [
                                    {
                                        title: '현물조회',
                                        value: '현물조회',
                                    },
                                    {
                                        title: '샘플신청',
                                        value: '샘플신청',
                                    },
                                    {
                                        title: '아이템 정보',
                                        value: '아이템 정보',
                                    },
                                ],
                            },
                            option: 0,
                            subOption: 0,
                        }
                        messageSend(message)
                    })
                } else {
                    text = `${strArr[0]}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`
                    handleOption(1)
                    handleSubOption(1)
                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        option: 1,
                        subOption: 1,
                    }
                    messageSend(message)
                }
                }).catch((err)=>{
                    text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                    handleOption(0)
                    handleSubOption(0);
                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        quickReplies : {
                            type: 'radio',
                            values: [
                                {
                                    title: '현물조회',
                                    value: '현물조회',
                                },
                                {
                                    title: '샘플신청',
                                    value: '샘플신청',
                                },
                                {
                                    title: '아이템 정보',
                                    value: '아이템 정보',
                                },
                            ],
                        },
                        option: 0,
                        subOption: 0,
                    }
                    messageSend(message)
                })
            Keyboard.dismiss()
        }
        if (strArr.length > 2 || strArr.length < 1) {
            text = `잘못 입력 하셨습니다. 다시 입력 해주세요.`
            option = 1;
            subOption = 1;
            create(text, option, subOption);
        }
    }

    if (option === 1 && subOption === 2 && text === '업체용') {
        axios.post(url + '/api/currentInventory.dab',
            {
                    itemName: item,
                    includeYN: 0
            }).then((resoponse) => {
                let r = resoponse.data;

                if (r !== undefined) {
                    let lastIndex = r.length - 1;
                    text = `${r[0].itemname} (${r[0].itemnocode})\n칼라별 수량\n\n`
                    r.map((i, index) => {
                        index === lastIndex ?
                            text += `${i.coloryw}\n${i.jaeqty}YD`
                            :
                            text += `${i.coloryw}\n${i.jaeqty}YD\n\n`
                    })

                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        quickReplies: {
                            type: 'radio',
                            values: [
                                {
                                    title: '현물조회',
                                    value: '현물조회',
                                },
                                {
                                    title: '샘플신청',
                                    value: '샘플신청',
                                },
                                {
                                    title: '아이템 정보',
                                    value: '아이템 정보',
                                },
                            ],
                        },
                        option: 0,
                        subOption: 0,
                    }
                    messageSend(message)
                    //로그입력
                    axios.post(url+`/api/insertLog.dab`,{
                        log_gb:'01',
                        item_code:r[0].itemcode,
                        item_name:r[0].itemname,
                        color_name:'전칼라',
                        user_name:userInfo.user_name,
                        role: userInfo.role,
                        cust_name:userInfo.company_name,
                    })
                }
            }).catch((err)=>{
                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
            })
        Keyboard.dismiss()
    }

    if (option === 1 && subOption === 2 && text === '직원용') {
        text = `1YD 이하인 칼라도 조회 하시겠습니까?`;
        option = 1;
        subOption = 3;
        quick = 6;
        create(text, option, subOption, quick, item)
    }

    if (option === 1 && subOption === 3 && text === '네') {
        axios.post(url + '/api/currentInventory.dab',
            {
                    itemName: item,
                    includeYN: 1
            }).then((resoponse) => {
                let r = resoponse.data;

                if (r !== undefined) {
                    let lastIndex = r.length - 1;
                    text = `${r[0].itemname} (${r[0].itemnocode})\n칼라별 수량\n\n`
                    r.map((i, index) => {
                        index === lastIndex ?
                            text += `${i.coloryw} (${i.colorname})\n현물 ${parseInt(i.jaeqty) + parseInt(i.gayoungqty) - parseInt(i.holdqty)}YD`
                            :
                            text += `${i.coloryw} (${i.colorname})\n현물 ${parseInt(i.jaeqty) + parseInt(i.gayoungqty) - parseInt(i.holdqty)}YD\n\n`
                    })

                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        quickReplies: {
                            type: 'radio',
                            values: [
                                {
                                    title: '현물조회',
                                    value: '현물조회',
                                },
                                {
                                    title: '샘플신청',
                                    value: '샘플신청',
                                },
                                {
                                    title: '아이템 정보',
                                    value: '아이템 정보',
                                },
                            ],
                        },
                        option: 0,
                        subOption: 0,
                    }
                    messageSend(message)
                    //로그입력
                    axios.post(url+`/api/insertLog.dab`,{
                        log_gb:'01',
                        item_code:r[0].itemcode,
                        item_name:r[0].itemname,
                        color_name:'전칼라',
                        user_name:userInfo.user_name,
                        role: userInfo.role,
                        cust_name:userInfo.company_name,
                    })
                }
            }).catch((err)=>{
                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
            })
    }

    if (option === 1 && subOption === 3 && text === '아니요') {
        axios.post(url + '/api/currentInventory.dab',
            {
                    itemName: item,
                    includeYN: 0
            }).then((resoponse) => {
                let r = resoponse.data;

                if (r !== undefined) {
                    let lastIndex = r.length - 1;
                    text = `${r[0].itemname} (${r[0].itemnocode})\n칼라별 수량\n\n`
                    r.map((i, index) => {
                        index === lastIndex ?

                            text += `${i.coloryw} (${i.colorname})\n현물 ${parseInt(i.jaeqty) + parseInt(i.gayoungqty) - parseInt(i.holdqty)}YD`
                            :
                            text += `${i.coloryw} (${i.colorname})\n현물 ${parseInt(i.jaeqty) + parseInt(i.gayoungqty) - parseInt(i.holdqty)}YD\n\n`
                    })

                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        quickReplies: {
                            type: 'radio',
                            values: [
                                {
                                    title: '현물조회',
                                    value: '현물조회',
                                },
                                {
                                    title: '샘플신청',
                                    value: '샘플신청',
                                },
                                {
                                    title: '아이템 정보',
                                    value: '아이템 정보',
                                },
                            ],
                        },
                        option: 0,
                        subOption: 0,
                    }
                    messageSend(message)
                    //로그입력
                    axios.post(url+`/api/insertLog.dab`,{
                        log_gb:'01',
                        item_code:r[0].itemcode,
                        item_name:r[0].itemname,
                        color_name:'전칼라',
                        user_name:userInfo.user_name,
                        role: userInfo.role,
                        cust_name:userInfo.company_name,
                    })
                }
            }).catch((err)=>{
                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
            })
    }

    // 현물조회(고객)
    if (option === 1 && subOption === 4 && blank_pattern.test(text) == true && text.length < 15){

        text = `잘못 입력 하셨습니다. 다시 입력 해주세요.`
        option = 1;
        subOption = 4;
        create(text, option, subOption);
    }

    if (option === 1 && subOption === 4 && text.length < 15) {
        let item = text;
        axios.post(url + '/api/currentInventory.dab',
            {
                    itemName: item,
                    includeYN: 1
            }).then((resoponse) => {
                let r = resoponse.data;
                if (r.length===0) {
                    text = `${item}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`
                    handleOption(1)
                    handleSubOption(4)
                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        option: 1,
                        subOption: 5,
                    }
                    messageSend(message)
                }
                if (r !== undefined && r.length !== 0) {
                    text = `${item}을 선택하셨습니다.\n조회를 원하시는 칼라 번호를\n선택해주세요.`
                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        quickReplies: {
                            type: 'radio',
                            values: [
                            ],
                        },
                        item: item,
                        option: 1,
                        subOption: 5,
                    }
                    r.forEach(i => message.quickReplies.values.push({ title: i.coloryw, value: i.coloryw }))
                    message.quickReplies.values.push({title: '전체컬러', value:'전체컬러'})
                    handleSubOption(5)
                    handleItem(item)
                    messageSend(message)
                } 
            }).catch((err)=>{
                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
            })
        Keyboard.dismiss()
    }
    if(option ===1 && subOption === 5 && text ==='전체컬러'){
        axios.post(url + '/api/currentInventory.dab',
            {
                    itemName: item,
                    includeYN: 0
            }).then((resoponse) => {
                let r = resoponse.data;

                if (r !== undefined) {
                    let lastIndex = r.length - 1;
                    text = `${r[0].itemname} (${r[0].itemnocode})\n칼라별 수량\n\n`
                    r.map((i, index) => {
                        index === lastIndex ?
                            text += `${i.coloryw}\n${i.jaeqty}YD`
                            :
                            text += `${i.coloryw}\n${i.jaeqty}YD\n\n`
                    })

                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        quickReplies: {
                            type: 'radio',
                            values: [
                                {
                                    title: '현물조회',
                                    value: '현물조회',
                                },
                                {
                                    title: '샘플신청',
                                    value: '샘플신청',
                                },
                                {
                                    title: '아이템 정보',
                                    value: '아이템 정보',
                                },
                            ],
                        },
                        option: 0,
                        subOption: 0,
                    }
                    messageSend(message)
                    //로그입력
                    axios.post(url+`/api/insertLog.dab`,{
                        log_gb:'01',
                        item_code:r[0].itemcode,
                        item_name:r[0].itemname,
                        color_name:'전칼라',
                        user_name:userInfo.user_name,
                        role: userInfo.role,
                        cust_name:userInfo.company_name,
                    })
                }
            }).catch((err)=>{
                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
            })
        Keyboard.dismiss()
    }

    if (option === 1 && subOption === 5 && text !=='전체컬러' && text.length < 15) {
        let color = text;
        scroll()
        axios.post(url + '/api/currentInventory.dab',
            {
                    itemName: item,
                    // colorYW: color,
                    includeYN: 1
            }).then((response) => {
                let res = response.data
                let r = res.filter(item => item.coloryw===color);
                if (res !== undefined) {
                    if(r.length !== 0){
                    if (parseInt(r[0].jaeqty) < 1) {
                        let similarColor = color.substring(0,3)
                        let recommend = res.filter(item=> item.coloryw.includes(similarColor))
                        let colorList =[];
                        recommend.forEach(item => {
                            if(item.jaeqty>0){
                                colorList.push({coloryw:item.coloryw,jaeqty:item.jaeqty})
                            }
                        })
                        if(colorList.length===0){
                            message = {
                                createdAt: new Date(),
                                _id: Math.round(Math.random() * 1000000),
                                text: `${r[0].itemname}\n${r[0].coloryw}\n\n현물없음`,
                                user: {
                                    _id: 2
                                },
                                quickReplies: {
                                    type: 'radio',
                                    values: [
                                        {
                                            title: '빠른수배 요청',
                                            value: '빠른수배 요청',
                                        },
                                        {
                                            title: '샘플신청',
                                            value: '샘플신청',
                                        },
                                        {
                                            title: '다시 선택',
                                            value: '다시 선택',
                                        },
                                        {
                                            title: '처음 단계로',
                                            value: '처음 단계로',
                                        },
                                    ],
                                },
                                option: 0,
                                subOption: 0,
                            }
                            
                            messageSend(message)
                        }
                        if(colorList.length>0){
                            let rcText='';
                            colorList.forEach(item=> rcText += `${item.coloryw} (${item.jaeqty})YD\n`)
                            message = {
                                createdAt: new Date(),
                                _id: Math.round(Math.random() * 1000000),
                                text: `현재 ${r[0].itemname}의\n${r[0].coloryw} 칼라는\n재고가 없습니다.\n\n유사한 칼라(재고)는\n${rcText}입니다.`,
                                user: {
                                    _id: 2
                                },
                                quickReplies: {
                                    type: 'radio',
                                    values: [
                                        {
                                            title: '빠른수배 요청',
                                            value: '빠른수배 요청',
                                        },
                                        {
                                            title: '샘플신청',
                                            value: '샘플신청',
                                        },
                                        {
                                            title: '다시 선택',
                                            value: '다시 선택',
                                        },
                                        {
                                            title: '처음 단계로',
                                            value: '처음 단계로',
                                        },
                                    ],
                                },
                                option: 0,
                                subOption: 0,
                            }
                            messageSend(message)
                        }
                    } else{
                        message = {
                            createdAt: new Date(),
                            _id: Math.round(Math.random() * 1000000),
                            text: `${r[0].itemname}\n${r[0].coloryw}\n\n현물 ${r[0].jaeqty}YD`,
                            user: {
                                _id: 2
                            },
                            quickReplies: {
                                type: 'radio',
                                values: [
                                    {
                                        title: '빠른수배 요청',
                                        value: '빠른수배 요청',
                                    },
                                    {
                                        title: '빠른 샘플신청',
                                        value: '빠른 샘플신청',
                                    },
                                    {
                                        title: '장바구니 담기',
                                        value: '장바구니 담기'
                                    },
                                    {
                                        title: '다시 선택',
                                        value: '다시 선택',
                                    },
                                    {
                                        title: '처음 단계로',
                                        value: '처음 단계로',
                                    },
                                ],
                            },
                            option: 0,
                            subOption: 0,
                        }
                        handleItemName(item)
                        handleColor(color)
                        messageSend(message)
                    }
                    //로그입력
                    axios.post(url+`/api/insertLog.dab`,{
                        log_gb:'01',
                        item_code:r[0].itemcode,
                        item_name:r[0].itemname,
                        color_name:r[0].coloryw,
                        hq_cnt:r[0].jaeqty,
                        deagu_cnt:r[0].gayoungqty,
                        prod_cnt:r[0].productqty,
                        hold_cnt:r[0].holdqty,
                        user_name:userInfo.user_name,
                        role: userInfo.role,
                        cust_name:userInfo.company_name,
                    })
                }
            }
            }).catch((err)=>{
                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
            })
        Keyboard.dismiss()
    }

    if (text === '빠른 샘플신청') {
        text = `원하시는 수량을 입력해주세요.`;
        option = 2;
        subOption = 6;
        create(text, option, subOption)
    }
    if (text === '장바구니 담기'){
        axios.post(url+`/api/searchItem.dab`,
        {
                itemName:item
        }).then((response)=>{
            if (response.data.itemCode !== null){
                let item_code = response.data.itemCode;
                axios.post(url + `/api/searchColor.dab`,
                {
                    itemCode: item_code,
                    colorYW: color
                }).then((response) => {
                    handleItemName(response.data.itemCode)
                    handleColor(response.data.colorNo)
                    axios.post(url + `/api/itemSpecInfo.dab`,
                    {
                            itemCode: item_code
                    }).then((response)=>{
                        handlePrice(response.data.priceC)
                    })
                   
                })
            }
        })
        text = `원하시는 수량을 입력해주세요.`;
        option = 4;
        subOption = 1;
        create(text, option, subOption);
    }
    if (text === '빠른수배 요청') {
        text = '빠른 수배 요청을 위해 담당자\n에게 전화를 겁니다.';
        quick = 7;
        let number = userInfo.manager_phone_number;
        create(text, option, subOption, quick)
        callNumber(number)
    }

    if (text === '다시 선택') {
        axios.post(url + '/api/currentInventory.dab',
            {
                    itemName: item,
                    includeYN: 1
            }).then((resoponse) => {
                let r = resoponse.data;

                if (r !== undefined) {
                    text = `${item}을 선택하셨습니다.\n조회를 원하시는 칼라 번호를\n선택해주세요.`
                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        quickReplies: {
                            type: 'radio',
                            values: [
                            ],
                        },
                        item: item,
                        option: 1,
                        subOption: 5,
                    }
                    r.forEach(i => message.quickReplies.values.push({ title: i.coloryw, valule: i.coloryw }))
                    handleOption(1)
                    handleSubOption(5)
                    handleItem(item)
                    messageSend(message)
                }
            }).catch((err)=>{
                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
            })
        Keyboard.dismiss()
    }

    // 샘플신청
    if (text === '샘플신청') {
        if (userInfo.role === 'client' || userInfo.role==='partner') {
            option = 2;
            subOption = 2;
            create(text, option, subOption)
        }
        if (userInfo.role === 'employee') {
            text = '샘플신청 입니다.\n\n거래처명을 입력하세요';
            option = 2;
            subOption = 1;
            create(text, option, subOption)
        }
    }

    if (option === 2 && subOption === 2) {
        text = `원하시는 아이템명, 컬러명, 수량을\n입력해주세요.\n\n예시) ${userInfo.promotion_Item} ${userInfo.promotion_Color} 10`;
        option = 2;
        subOption = 3;
        create(text, option, subOption)
    }

    if (option === 2 && subOption === 5) {
        let c = text;
        company = company.filter(company => company.custName === c)
        handleCompany(company)
        text = `${c}을/를 선택하셨습니다.`;
        option = 2
        subOption = 2
        create(text, option, subOption, undefined, undefined, undefined, c)
    }

    if (option === 2 && subOption === 1 && !text.includes('거래처명')) {

        axios.post(url + '/api/searchCustmors.dab',
             { custName: text }
            )
            .then((response) => {
                let companyList = [];
                response.data.forEach(i => companyList.push(i));
                if (companyList.length === 1) {
                    let c = text;
                    handleOption(2);
                    handleSubOption(2);
                    handleCompany(companyList);
                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: `${c}을/를 선택하셨습니다.`,
                        user: {
                            _id: 2
                        },
                        option: 2,
                        subOption: 2,
                        company: c
                    }
                    messageSend(message)
                }
                if (companyList.length > 1) {
                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: '해당하는 거래처를 선택해주세요',
                        user: {
                            _id: 2
                        },
                        option: 2,
                        subOption: 1,
                    }
                    messageSend(message)
                    handleCompany(companyList)
                    selectCompany(companyList)
                    Keyboard.dismiss()
                }
                if (companyList.length === 0) {
                    handleOption = 2;
                    handleSubOption = 1;
                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: '해당하는 거래처명이 없습니다.\n다시 검색해주세요.',
                        user: {
                            _id: 2
                        },
                        option: 2,
                        subOption: 1,
                    }
                    messageSend(message)
                }
            }).catch((err)=>{
                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
            })
    }

    if (option === 2 && subOption === 3 && !text.includes('원하시는')) {
        let textArr = text.split('\n');
        textArr.forEach((text) => {
            let strArr = text.split(' ')
            if (userInfo.role==="employee" && strArr.length < 3 && strArr.length > 4) {
                text = `잘못 입력 하셨습니다. 다시 입력해 주세요.`
                create(text, 2, 2)
                textArr = false;
            }
            if (userInfo.role==="client" && strArr.length > 3) {
                text = `잘못 입력 하셨습니다. 다시 입력해 주세요.`
                create(text, 2, 2)
                textArr = false;
            }
            if (userInfo.role==='partner' && strArr.length >3){
                text = `잘못 입력 하셨습니다. 다시 입력해 주세요.`
                create(text, 2, 2)
                textArr = false;
            }
            let qty = Number(strArr[2]);
            if (isNaN(qty)) {
                text = `인식할 수 없는 단위입니다.`
                create(text, 2, 2)
                textArr = false;
            }
            if (qty === 0 || qty > 19) {
                text = `샘플신청 수량은 20YD 미만만 가능합니다..`
                create(text, 2, 2)
                textArr = false
            }
        })

        if (textArr) {
            let itemList = [];
            textArr.forEach((text) => {
                let strArr = text.split(' ')
                let item = {
                    item_name: ``,
                    item_code: ``,
                    color_code: ``,
                    colorYW: ``,
                    amount: ``,
                    price: ``
                }
                axios.post(url + `/api/searchItem.dab`,
                    {
                            itemName: strArr[0]
                    }).then((response) => {
                        if (response.data.itemCode !== null) {
                            item.item_name = response.data.itemName;
                            item.item_code = response.data.itemCode;
                            axios.post(url + `/api/searchColor.dab`,
                                {
                                        itemCode: item.item_code,
                                        colorYW: strArr[1]
                                }).then((response) => {
                                    if (response.data.colorNo !== null) {
                                        item.colorYW = response.data.colorYW;
                                        item.color_code = response.data.colorNo;
                                        item.amount = strArr[2]
                                        if (strArr[3] !== undefined) {
                                            item.price = toCommaStringF(strArr[3])
                                        }
                                        if (strArr[3] === undefined){
                                            axios.post(url + `/api/itemSpecInfo.dab`,
                                            {
                                                    itemCode: item.item_code
                                            }).then((response)=>{
                                                item.price=response.data.priceC
                                            }).catch((err)=>{
                                                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                                                handleOption(0)
                                                handleSubOption(0);
                                                message = {
                                                    createdAt: new Date(),
                                                    _id: Math.round(Math.random() * 1000000),
                                                    text: text,
                                                    user: {
                                                        _id: 2
                                                    },
                                                    quickReplies : {
                                                        type: 'radio',
                                                        values: [
                                                            {
                                                                title: '현물조회',
                                                                value: '현물조회',
                                                            },
                                                            {
                                                                title: '샘플신청',
                                                                value: '샘플신청',
                                                            },
                                                            {
                                                                title: '아이템 정보',
                                                                value: '아이템 정보',
                                                            },
                                                        ],
                                                    },
                                                    option: 0,
                                                    subOption: 0,
                                                }
                                                messageSend(message)
                                            })
                                        }
                                        itemList.push(item)
                                        if (textArr.length === itemList.length) {
                                            handleOption(2)
                                            handleSubOption(4)
                                            handleItem(itemList)
                                            let message = {
                                                createdAt: new Date(),
                                                _id: Math.round(Math.random() * 1000000),
                                                text: `배송 밥법을 선택해 주세요.`,
                                                user: {
                                                    _id: 2
                                                },
                                                quickReplies: {
                                                    type: 'radio',
                                                    values: [
                                                        {
                                                            title: '매장',
                                                            value: '매장',
                                                        },
                                                        {
                                                            title: '영업사원전달',
                                                            value: '영업사원전달',
                                                        }
                                                    ],
                                                },
                                                option: 2,
                                                subOption: 4,
                                                item: itemList
                                            }
                                            messageSend(message)
                                            Keyboard.dismiss()
                                        }
                                    }
                                    if (response.data.colorNo === null) {
                                        let message = {
                                            createdAt: new Date(),
                                            _id: Math.round(Math.random() * 1000000),
                                            text: `'${strArr[0]}'의 '${strArr[1]}' 칼라가 없\n습니다.\n\n칼라명을 확인 후 다시 입력해\n주세요.`,
                                            user: {
                                                _id: 2
                                            },
                                            option: 2,
                                            subOption: 2,
                                        }
                                        messageSend(message)
                                    }
                                }).catch((err)=>{
                                    text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                                    handleOption(0)
                                    handleSubOption(0);
                                    message = {
                                        createdAt: new Date(),
                                        _id: Math.round(Math.random() * 1000000),
                                        text: text,
                                        user: {
                                            _id: 2
                                        },
                                        quickReplies : {
                                            type: 'radio',
                                            values: [
                                                {
                                                    title: '현물조회',
                                                    value: '현물조회',
                                                },
                                                {
                                                    title: '샘플신청',
                                                    value: '샘플신청',
                                                },
                                                {
                                                    title: '아이템 정보',
                                                    value: '아이템 정보',
                                                },
                                            ],
                                        },
                                        option: 0,
                                        subOption: 0,
                                    }
                                    messageSend(message)
                                })
                        }
                        if (response.data.itemCode === null) {
                            let message = {
                                createdAt: new Date(),
                                _id: Math.round(Math.random() * 1000000),
                                text: `'${strArr[0]}'의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`,
                                user: {
                                    _id: 2
                                },
                                option: 2,
                                subOption: 2,
                            }
                            messageSend(message)
                        }
                    }).catch((err)=>{
                        text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                        handleOption(0)
                        handleSubOption(0);
                        message = {
                            createdAt: new Date(),
                            _id: Math.round(Math.random() * 1000000),
                            text: text,
                            user: {
                                _id: 2
                            },
                            quickReplies : {
                                type: 'radio',
                                values: [
                                    {
                                        title: '현물조회',
                                        value: '현물조회',
                                    },
                                    {
                                        title: '샘플신청',
                                        value: '샘플신청',
                                    },
                                    {
                                        title: '아이템 정보',
                                        value: '아이템 정보',
                                    },
                                ],
                            },
                            option: 0,
                            subOption: 0,
                        }
                        messageSend(message)
                    })
            })
        }
    }
    if (option === 2 && subOption === 6 && !text.includes('원하시는') && !text.includes('신청하신')) {
        let textArr = []
        textArr.push(`${itemName} ${color} ${text}`)

        textArr.forEach((text) => {
            let strArr = text.split(' ')
            if (userInfo.role==="employee" && strArr.length < 3 && strArr.length > 4) {
                text = `잘못 입력 하셨습니다. 다시 입력해 주세요.`
                create(text, 2, 2)
                textArr = false;
            }
            if (userInfo.role==="client" && strArr.length > 3) {
                text = `잘못 입력 하셨습니다. 다시 입력해 주세요.`
                create(text, 2, 2)
                textArr = false;
            }
            if (userInfo.role==='partner' && strArr.length >3){
                text = `잘못 입력 하셨습니다. 다시 입력해 주세요.`
                create(text, 2, 2)
                textArr = false;
            }
            let qty = Number(strArr[2]);
            if (isNaN(qty)) {
                text = `인식할 수 없는 단위입니다.`
                create(text, 2, 2)
                textArr = false;
            }
            if (qty === 0 || qty >= 20) {
                text = `샘플신청 수량은 20YD 미만만 가능합니다..`
                create(text, 2, 2)
                textArr = false
            }
        })

        if (textArr) {
            let itemList = [];
            textArr.forEach((text) => {
                let strArr = text.split(' ')
                let item = {
                    item_name: ``,
                    item_code: ``,
                    color_code: ``,
                    colorYW: ``,
                    amount: ``,
                    price: ``
                }
                axios.post(url + `/api/searchItem.dab`,
                    {
                            itemName: strArr[0]
                    }).then((response) => {
                        if (response.data.itemCode !== null) {
                            item.item_name = response.data.itemName;
                            item.item_code = response.data.itemCode;
                            axios.post(url + `/api/searchColor.dab`,
                                {
                                        itemCode: item.item_code,
                                        colorYW: strArr[1]
                                }).then((response) => {
                                    if (response.data.colorNo !== null) {
                                        item.colorYW = response.data.colorYW;
                                        item.color_code = response.data.colorNo;
                                        item.amount = strArr[2]
                                        if (strArr[3] !== undefined) {
                                            item.price = toCommaStringF(strArr[3])
                                        }
                                        if (strArr[3] === undefined){
                                            axios.post(url + `/api/itemSpecInfo.dab`,
                                            {
                                                    itemCode: item.item_code
                                            }).then((response)=>{
                                                item.price=response.data.priceC
                                            }).catch((err)=>{
                                                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                                                handleOption(0)
                                                handleSubOption(0);
                                                message = {
                                                    createdAt: new Date(),
                                                    _id: Math.round(Math.random() * 1000000),
                                                    text: text,
                                                    user: {
                                                        _id: 2
                                                    },
                                                    quickReplies : {
                                                        type: 'radio',
                                                        values: [
                                                            {
                                                                title: '현물조회',
                                                                value: '현물조회',
                                                            },
                                                            {
                                                                title: '샘플신청',
                                                                value: '샘플신청',
                                                            },
                                                            {
                                                                title: '아이템 정보',
                                                                value: '아이템 정보',
                                                            },
                                                        ],
                                                    },
                                                    option: 0,
                                                    subOption: 0,
                                                }
                                                messageSend(message)
                                            })
                                        }
                                        itemList.push(item)
                                        if (textArr.length === itemList.length) {
                                            handleOption(2)
                                            handleSubOption(4)
                                            handleItem(itemList)
                                            let message = {
                                                createdAt: new Date(),
                                                _id: Math.round(Math.random() * 1000000),
                                                text: `배송 밥법을 선택해 주세요.`,
                                                user: {
                                                    _id: 2
                                                },
                                                quickReplies: {
                                                    type: 'radio',
                                                    values: [
                                                        {
                                                            title: '매장',
                                                            value: '매장',
                                                        },
                                                        {
                                                            title: '영업사원전달',
                                                            value: '영업사원전달',
                                                        }
                                                    ],
                                                },
                                                option: 2,
                                                subOption: 4,
                                                item: itemList
                                            }
                                            messageSend(message)
                                            Keyboard.dismiss()
                                        }
                                    }
                                    if (response.data.colorNo === null) {
                                        let message = {
                                            createdAt: new Date(),
                                            _id: Math.round(Math.random() * 1000000),
                                            text: `'${strArr[0]}'의 '${strArr[1]}' 칼라가 없\n습니다.\n\n칼라명을 확인 후 다시 입력해\n주세요.`,
                                            user: {
                                                _id: 2
                                            },
                                            option: 2,
                                            subOption: 2,
                                        }
                                        messageSend(message)
                                    }
                                }).catch((err)=>{
                                    text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                                    handleOption(0)
                                    handleSubOption(0);
                                    message = {
                                        createdAt: new Date(),
                                        _id: Math.round(Math.random() * 1000000),
                                        text: text,
                                        user: {
                                            _id: 2
                                        },
                                        quickReplies : {
                                            type: 'radio',
                                            values: [
                                                {
                                                    title: '현물조회',
                                                    value: '현물조회',
                                                },
                                                {
                                                    title: '샘플신청',
                                                    value: '샘플신청',
                                                },
                                                {
                                                    title: '아이템 정보',
                                                    value: '아이템 정보',
                                                },
                                            ],
                                        },
                                        option: 0,
                                        subOption: 0,
                                    }
                                    messageSend(message)
                                })
                        }
                        if (response.data.itemCode === null) {
                            let message = {
                                createdAt: new Date(),
                                _id: Math.round(Math.random() * 1000000),
                                text: `'${strArr[0]}'의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`,
                                user: {
                                    _id: 2
                                },
                                option: 2,
                                subOption: 2,
                            }
                            messageSend(message)
                        }
                    }).catch((err)=>{
                        text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                        handleOption(0)
                        handleSubOption(0);
                        message = {
                            createdAt: new Date(),
                            _id: Math.round(Math.random() * 1000000),
                            text: text,
                            user: {
                                _id: 2
                            },
                            quickReplies : {
                                type: 'radio',
                                values: [
                                    {
                                        title: '현물조회',
                                        value: '현물조회',
                                    },
                                    {
                                        title: '샘플신청',
                                        value: '샘플신청',
                                    },
                                    {
                                        title: '아이템 정보',
                                        value: '아이템 정보',
                                    },
                                ],
                            },
                            option: 0,
                            subOption: 0,
                        }
                        messageSend(message)
                    })
            })
        }
    }

    if (option === 2 && subOption === 4 && text.length < 10) {
        let method = text;
        let date = new Date();
        let hour = date.getHours();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let time;

        if (month < 10) {
            month = "0" + month;
        }

        if (day < 10) {
            day = "0" + day;
        }

        let order = {
            company_code: company[0].custCode,
            delyDate: '',
            deli_type: '',
            dept: userInfo.dept,
            remark: '',
            manager_id: userInfo.manager_id,
            object_id: userInfo.object_id,
            detailList: []
        }

        let orderList = ``;

        if (method === '영업사원전달') {
            method = '영업사원 직접전달';
            order.delyDate = `${year}-${month}-${day}`;
            order.deli_type = 20;
            order.remark = (userInfo.role === 'employee') ? '답돌이 직원 등록' : `답돌이 고객 등록 (${userInfo.user_name})`;
        }

        if (method === '매장') {
            if (hour < 14) {
                order.delyDate = `${year}-${month}-${day}`;
            }
            else if (hour >= 14) {
                day = day + 1
                order.delyDate = `${year}-${month}-${day}`;
            }
            if (hour >= 11 && hour < 14) {
                order.deli_type = 11;
                time = '2타임'
            } else {
                order.deli_type = 10;
                time = '1타임'
            }
            order.remark = (userInfo.role === 'employee') ? '답돌이 직원 등록' : `답돌이 고객 등록 (${userInfo.user_name})`;
        }

        item.forEach((orderItem, index) => {
                    orderList += `${index + 1}. ${orderItem.item_name} / ${orderItem.colorYW} /\n${orderItem.amount}YD ${userInfo.role === 'employee' ? '단가 ' + orderItem.price + '원' : ''}\n`
                    orderItem.price = orderItem.price.replace(',','')
                    order.detailList.push(orderItem)
                })
                text = `${company[0].custName}
                    
=====주문내역=====
${orderList}
====== 배송 ======
${method} ${time === undefined ? '' : time}
                                        
신청하신 내용이 맞습니까?`
        create(text,2, 8, 4, order)
    }

    if (text === '네, 주문완료'){
        axios.post(url+`/api/createOrder.dab`,
        {
            companyCode: item.company_code,
            delyDate: item.delyDate,
            deli_type: item.deli_type,
            dept: item.dept,
            remark: item.remark,
            manager_id: item.manager_id,
            object_id: item.object_id,
            detailList: item.detailList
        }).then((response)=>{
            if(response.data.result==='SUCCESS'){
                text = `신청하신 내용이 정상적으로 등\n록되었습니다.\n\n주문번호는 ${response.data.cause}\n입니다.`;
                handleOption(0)
                handleSubOption(0)

                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }

                let deliType = (item.deli_type===20)?'02':'01';
                let deliTime='0';
                
                switch (item.deli_type) {
                    case 10:
                        deliTime='1';
                    case 11:
                        deliTime='2';
                        break;
                    default:
                        break;
                }
                //로그입력
                item.detailList.forEach((i)=>{
                    axios.post(url+`/api/insertLog.dab`,{
                        log_gb:'02',
                        item_code:i.item_code,
                        item_name:i.item_name,
                        color_name:i.colorYW,
                        user_name:userInfo.user_name,
                        role: userInfo.role,
                        cust_name:userInfo.company_name,
                        order_no:response.data.cause,
                        order_cnt:i.amount,
                        deli_gb:deliType,
                        deli_time:deliTime,
                        deli_memo:item.remark
                    })
                })


                //푸시메세지
                if(userInfo.role==='client'){
                    let pushToken = userInfo.manager_firebase_token;
                    sendPushNotification(pushToken,`${userInfo.company_name} 오더 단가를 확정해주세요.`)
                }
                messageSend(message)
            }
            if(response.data.result==='FAIL'){
                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies: {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
            }
        }).catch((err)=>{
            text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
            handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies: {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
        })
    }

    if(text === '네, 전달사항 추가'){
        text = `전달사항을 입력해주세요.`
        option = 2
        subOption= 7
        create(text,option,subOption,undefined,item)
    }

    if(option === 2 && subOption === 7 && !text.includes('전달사항을 입력해주세요.')){
        item.remark += ` ${text}`
        axios.post(url+`/api/createOrder.dab`,
            {
                    companyCode: item.company_code,
                    delyDate: item.delyDate,
                    deli_type: item.deli_type,
                    dept: item.dept,
                    remark: item.remark,
                    manager_id: item.manager_id,
                    object_id: item.object_id,
                    detailList: item.detailList
        }).then((response)=>{
            if(response.data.result==='SUCCESS'){
                text = `신청하신 내용이 정상적으로 등\n록되었습니다.\n\n주문번호는 ${response.data.cause}\n입니다.`;
                handleOption(0)
                handleSubOption(0)

                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }

                let deliType = (item.deli_type===20)?'02':'01';
                let deliTime='0';
                
                switch (item.deli_type) {
                    case 10:
                        deliTime='1';
                    case 11:
                        deliTime='2';
                        break;
                    default:
                        break;
                }
                //로그입력
                item.detailList.forEach((i)=>{
                    axios.post(url+`/api/insertLog.dab`,{
                        log_gb:'02',
                        item_code:i.item_code,
                        item_name:i.item_name,
                        color_name:i.colorYW,
                        user_name:userInfo.user_name,
                        role: userInfo.role,
                        cust_name:userInfo.company_name,
                        order_no:response.data.cause,
                        order_cnt:i.amount,
                        deli_gb:deliType,
                        deli_time:deliTime,
                        deli_memo:item.remark
                    })
                })

                //푸시메세지
                if(userInfo.role==='client'){
                    let pushToken = userInfo.manager_firebase_token;
                    sendPushNotification(pushToken,`${userInfo.company_name} 오더 단가를 확정해주세요.`)
                }
                messageSend(message)
            }
            if(response.data.result==='FAIL'){
                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
            }
        }).catch((err)=>{
            text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
            handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
        })
        Keyboard.dismiss()
    }

    if(text === '아니요, 다시입력') {
        text = text;
        option = 5;
        create(text, option)
    }

    // 아이템 정보
    if (text === '아이템 정보') {
        text = '정보 조회를 원하는 아이템명을\n입력해주세요.';
        option = 3;
        subOption = 1;
        create(text, option, subOption)
    }

    if (option === 3 && subOption === 1 && userInfo.role === 'client' && text.length < 10) {
        axios.post(url+`/api/searchItem.dab`,
        {
                itemName:text
        }).then((response)=>{
            let itemCode = response.data.itemCode;
            axios.post(url+`/api/itemSpecInfo.dab`,
                {
                        itemCode:itemCode
                }
            ).then((response)=>{
                let spec = response.data;

                let price = spec.prodList[0].price.split('.')
                let check = spec.dry_friction===null
                text = `${text} 스펙\n\n염색 : ${spec.dyeingGbn}\n혼용률 : ${spec.composition}\n사용폭 : ${spec.width}±2%,   중량 : ${spec.weight} g/yd\n조직도 : ${spec.organization},   FINISH : ${spec.finish}\n${userInfo.access_level==='3'?`\n단가 : ${spec.priceC}원\n`:''}\n${userInfo.specGB==='Y'?`경사사종/번수\n - ${spec.ksajong}\n위사사종/번수\n - ${spec.wsajong}\n경사밀도 : ${spec.kdensity}\n위사밀도 : ${spec.wdensity}\n\n`:''}${check?'':`*견뢰도*\n건마찰 : ${spec.dry_friction},     습마찰 : ${spec.swrat_friction}\n세   탁 : ${spec.cleaning},     드라이 : ${spec.dry}\n땀 : ${spec.sweat}`}${userInfo.priceGB==='Y'?`\n\n매입단가\n${spec.prodList[0].custName} : ${price[0]}원`:''}`
                
                handleOption(0)
                handleSubOption(0)
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies: {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0
                }
                messageSend(message)
                Keyboard.dismiss()
                //로그입력
                axios.post(url+`/api/insertLog.dab`,{
                    log_gb:'03',
                    item_code:itemCode,
                    item_name:response.data.itemName,
                    user_name:userInfo.user_name,
                    role: userInfo.role,
                    cust_name:userInfo.company_name
                })
            }).catch((err)=>{
                if(err.message.includes('spec.prodList[0]')){
                    text = `${text}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`;
                handleOption(3)
                handleSubOption(1);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    option: 3,
                    subOption: 1,
                }
                messageSend(message)
                } else{
                    text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                    handleOption(0)
                    handleSubOption(0);
                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        quickReplies : {
                            type: 'radio',
                            values: [
                                {
                                    title: '현물조회',
                                    value: '현물조회',
                                },
                                {
                                    title: '샘플신청',
                                    value: '샘플신청',
                                },
                                {
                                    title: '아이템 정보',
                                    value: '아이템 정보',
                                },
                            ],
                        },
                        option: 0,
                        subOption: 0,
                    }
                    messageSend(message)
                }
            })
        }).catch((err)=>{
            text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
        })
    }
    if (option === 3 && subOption === 1 && userInfo.role === 'partner' && text.length < 10) {
        axios.post(url+`/api/searchItem.dab`,
        {
                itemName:text
        }).then((response)=>{
            let itemCode = response.data.itemCode;
            axios.post(url+`/api/itemSpecInfo.dab`,
                {
                        itemCode:itemCode
                }
            ).then((response)=>{
                let spec = response.data;

                let price = spec.prodList[0].price.split('.')
                let check = spec.dry_friction===null
                text = `${text} 스펙\n\n염색 : ${spec.dyeingGbn}\n혼용률 : ${spec.composition}\n사용폭 : ${spec.width}±2%,   중량 : ${spec.weight} g/yd\n조직도 : ${spec.organization},   FINISH : ${spec.finish}\n${userInfo.access_level==='3'?`\n단가 : ${spec.priceC}원\n`:''}\n${userInfo.specGB==='Y'?`경사사종/번수\n - ${spec.ksajong}\n위사사종/번수\n - ${spec.wsajong}\n경사밀도 : ${spec.kdensity}\n위사밀도 : ${spec.wdensity}\n\n`:''}${check?'':`*견뢰도*\n건마찰 : ${spec.dry_friction},     습마찰 : ${spec.swrat_friction}\n세   탁 : ${spec.cleaning},     드라이 : ${spec.dry}\n땀 : ${spec.sweat}`}${userInfo.priceGB==='Y'?`\n\n매입단가\n${spec.prodList[0].custName} : ${price[0]}원`:''}`
                
                handleOption(0)
                handleSubOption(0)
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies: {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0
                }
                messageSend(message)
                Keyboard.dismiss()
                //로그입력
                axios.post(url+`/api/insertLog.dab`,{
                    log_gb:'03',
                    item_code:itemCode,
                    item_name:response.data.itemName,
                    user_name:userInfo.user_name,
                    role: userInfo.role,
                    cust_name:userInfo.company_name
                })
            }).catch((err)=>{
                if(err.message.includes('spec.prodList[0]')){
                    text = `${text}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`;
                handleOption(3)
                handleSubOption(1);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    option: 3,
                    subOption: 1,
                }
                messageSend(message)
                } else{
                    text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                    handleOption(0)
                    handleSubOption(0);
                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        quickReplies : {
                            type: 'radio',
                            values: [
                                {
                                    title: '현물조회',
                                    value: '현물조회',
                                },
                                {
                                    title: '샘플신청',
                                    value: '샘플신청',
                                },
                                {
                                    title: '아이템 정보',
                                    value: '아이템 정보',
                                },
                            ],
                        },
                        option: 0,
                        subOption: 0,
                    }
                    messageSend(message)
                }
            })
        }).catch((err)=>{
            text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
        })
    }

    if (option === 3 && subOption === 1 && userInfo.role === 'employee' && text.length < 10) {
        axios.post(url+`/api/searchItem.dab`,
        {
                itemName:text
        }).then((response)=>{

            if(response.data.itemName===null){
                text = `${text}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`;
                handleOption(3)
                handleSubOption(1);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    option: 3,
                    subOption: 1,
                }
                messageSend(message)
            } else {
                let item = text;
                text = '조회 항목을 선택해 주세요.';
                quick = 2;
                handleOption(3)
                handleSubOption(2);
                handleItem(item)
                message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        quickReplies: {
                            type: 'radio',
                            values: [
                                {
                                    title: '업차지',
                                    value: '업차지',
                                },
                                {
                                    title: '스펙과 단가',
                                    value: '스펙과 단가',
                                },
                                {
                                    title: '다른 아이템 조회',
                                    value: '다른 아이템 조회'
                                },
                                {
                                    title: '처음 단계로',
                                    value: '처음 단계로',
                                },
                            ],
                        },
                        option: 3,
                        subOption: 2,
                        item:item
                    }
                    messageSend(message)
               
                    Keyboard.dismiss()
            }
            
            }).catch((err)=>{
                if(err.message.includes('spec.prodList[0]')){
                    text = `${text}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`;
                handleOption(3)
                handleSubOption(1);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    option: 3,
                    subOption: 1,
                }
                messageSend(message)
                } else{
                    text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                    handleOption(0)
                    handleSubOption(0);
                    message = {
                        createdAt: new Date(),
                        _id: Math.round(Math.random() * 1000000),
                        text: text,
                        user: {
                            _id: 2
                        },
                        quickReplies : {
                            type: 'radio',
                            values: [
                                {
                                    title: '현물조회',
                                    value: '현물조회',
                                },
                                {
                                    title: '샘플신청',
                                    value: '샘플신청',
                                },
                                {
                                    title: '아이템 정보',
                                    value: '아이템 정보',
                                },
                            ],
                        },
                        option: 0,
                        subOption: 0,
                    }
                    messageSend(message)
                }
            })
    }
    
    if (text === '업차지' && option === 3 && subOption === 2) {
        axios.post(url+`/api/searchItem.dab`,
        {
                itemName:item
        }).then((response)=>{
            let itemCode = response.data.itemCode;
            axios.post(url+`/api/itemSpecInfo.dab`,
                {
                        itemCode:itemCode
                }
            ).then((response)=>{
                let spec = response.data;
                
                
                let text;
                let custName = spec.prodList[0].custName

                switch (custName) {
                    case '지사(대구)':
                        if(spec.dyeingGbn==='선염'){
                            text = `1000이하 45만원\n예) 500 - 900원\n900 - 500원`
                        } else{
                            text = `500이하 30만\n500~700사이 400원`
                        }
                        break;
                    case '성재패브릭(외주가공)':
                        text = `500이하 30만\n500~700사이 400`
                        break;
                    case `유나이텍스`:
                        text = `200~400사이 30만\n500~600사이 300원\n600~700사이 200원\n700이상 업차지 무`;
                        break;
                    case '케이디에프':
                        text = `300이하 30만\n300~500사이 500원\n500 이상 업차지 무`;
                        break;
                    case `(주)삼용`:
                        text = `300~700이하 20만\n700이상 업차지 무`;
                        break;
                    case `케이비텍스타일(KB TEXTILE)`:
                        text = `100~400사이 20만\n400이상 업챠지 무`;
                        break;
                    case '에스디텍스(SD)':
                        text = `100~500사이 20만`;
                        break;
                    case '자미보':
                        text = `300이하 20만\n300~500사이 10만\n500이상 업차지 무`
                        break;
                    case '(주)앤디아이(임가공)':
                        text =`500이하 20만`;
                        break;
                    default:
                        text = '업차지 정보가 입력되어있지 않습니다.'
                        break;
                }
                handleOption(3)
                handleSubOption(2)

                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies: {
                        type: 'radio',
                        values: [
                            {
                                title: '업차지',
                                value: '업차지',
                            },
                            {
                                title: '스펙과 단가',
                                value: '스펙과 단가',
                            },
                            {
                                title: '다른 아이템 조회',
                                value: '다른 아이템 조회'
                            },
                            {
                                title: '처음 단계로',
                                value: '처음 단계로',
                            },
                        ],
                    },
                    option: 3,
                    subOption: 2
                }
                messageSend(message)
                Keyboard.dismiss()
            }).catch((err)=>{
                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
            })
        }).catch((err)=>{
            text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
            handleOption(0)
            handleSubOption(0);
            message = {
                createdAt: new Date(),
                _id: Math.round(Math.random() * 1000000),
                text: text,
                user: {
                    _id: 2
                },
                quickReplies : {
                    type: 'radio',
                    values: [
                        {
                            title: '현물조회',
                            value: '현물조회',
                        },
                        {
                            title: '샘플신청',
                            value: '샘플신청',
                        },
                        {
                            title: '아이템 정보',
                            value: '아이템 정보',
                        },
                    ],
                },
                option: 0,
                subOption: 0,
            }
            messageSend(message)
        })
    }

    if (text === '스펙과 단가' && option === 3 && subOption === 2) {
        axios.post(url+`/api/searchItem.dab`,
        {
                itemName:item
        }).then((response)=>{
            let itemCode = response.data.itemCode;
            axios.post(url+`/api/itemSpecInfo.dab`,
                {
                        itemCode:itemCode
                }
            ).then((response)=>{
                let spec = response.data;

                let price = spec.prodList[0].price.split('.')
                let check = spec.dry_friction===null
                text = `${item} 스펙\n\n염색 : ${spec.dyeingGbn}\n혼용률 : ${spec.composition}\n사용폭 : ${spec.width}±2%,   중량 : ${spec.weight} g/yd\n조직도 : ${spec.organization},   FINISH : ${spec.finish}\n${userInfo.access_level==='3'?`\n단가 : ${spec.priceC}원\n`:''}\n${userInfo.specGB==='Y'?`경사사종/번수\n - ${spec.ksajong}\n위사사종/번수\n - ${spec.wsajong}\n경사밀도 : ${spec.kdensity}\n위사밀도 : ${spec.wdensity}\n\n`:''}${check?'':`*견뢰도*\n건마찰 : ${spec.dry_friction},     습마찰 : ${spec.swrat_friction}\n세   탁 : ${spec.cleaning},     드라이 : ${spec.dry}\n땀 : ${spec.sweat}`}${userInfo.priceGB==='Y'?`\n\n매입단가\n${spec.prodList[0].custName} : ${price[0]}원`:''}`
                
                handleOption(3)
                handleSubOption(2)
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies: {
                        type: 'radio',
                        values: [
                            {
                                title: '업차지',
                                value: '업차지',
                            },
                            {
                                title: '스펙과 단가',
                                value: '스펙과 단가',
                            },
                            {
                                title: '다른 아이템 조회',
                                value: '다른 아이템 조회'
                            },
                            {
                                title: '처음 단계로',
                                value: '처음 단계로',
                            },
                        ],
                    },
                    option: 3,
                    subOption: 2
                }
                messageSend(message)
                Keyboard.dismiss()

                //로그입력
                axios.post(url+`/api/insertLog.dab`,{
                    log_gb:'03',
                    item_code:itemCode,
                    item_name:item,
                    user_name:userInfo.user_name,
                    role: userInfo.role,
                    cust_name:userInfo.company_name
                })
            }).catch((err)=>{
                text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies : {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
            })
        }).catch((err)=>{
            text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
            handleOption(0)
            handleSubOption(0);
            message = {
                createdAt: new Date(),
                _id: Math.round(Math.random() * 1000000),
                text: text,
                user: {
                    _id: 2
                },
                quickReplies : {
                    type: 'radio',
                    values: [
                        {
                            title: '현물조회',
                            value: '현물조회',
                        },
                        {
                            title: '샘플신청',
                            value: '샘플신청',
                        },
                        {
                            title: '아이템 정보',
                            value: '아이템 정보',
                        },
                    ],
                },
                option: 0,
                subOption: 0,
            }
            messageSend(message)
        })
    }
    if(text === '다른 아이템 조회'){
        text = '정보 조회를 원하는 아이템명을\n입력해주세요.';
        option = 3;
        subOption = 1;
        create(text, option, subOption)
    }
    if (option === 4 && subOption ===1 && !text.includes('원하시는') && text.length < 15){
        price = price.replace(',','')
        axios.post(url+`/api/insertCart.dab`,
        {
            user_id: userInfo.object_id,
            item_code: itemName,
            color_code: color,
            price: price,
            amount: text
        }).then((response)=>{
            text = '해당 상품이 장바구니에 등록 되었습니다.';
            handleOption(0)
            handleSubOption(0);
            message = {
                createdAt: new Date(),
                _id: Math.round(Math.random() * 1000000),
                text: text,
                user: {
                    _id: 2
                },
                quickReplies: {
                    type: 'radio',
                    values: [
                        {
                            title: '현물조회',
                            value: '현물조회',
                        },
                        {
                            title: '샘플신청',
                            value: '샘플신청',
                        },
                        {
                            title: '아이템 정보',
                            value: '아이템 정보',
                        },
                    ],
                },
                option: 0,
                subOption: 0,
            }
            messageSend(message)
        }).catch((err)=>{
            text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                handleOption(0)
                handleSubOption(0);
                message = {
                    createdAt: new Date(),
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    user: {
                        _id: 2
                    },
                    quickReplies: {
                        type: 'radio',
                        values: [
                            {
                                title: '현물조회',
                                value: '현물조회',
                            },
                            {
                                title: '샘플신청',
                                value: '샘플신청',
                            },
                            {
                                title: '아이템 정보',
                                value: '아이템 정보',
                            },
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                messageSend(message)
        })
    }
    // if(text === '푸시 테스트'){
    //     let pushToken = 'ExponentPushToken[fBVtqiPHhGeY2EvqUXHBkl]';
    //     sendPushNotification(pushToken,`푸시테스트`)
    //     text = '푸시를 보내고처음으로 돌아갑니다.';
    //     create(text, 0, 0, 1)
    // }
    
    if (text === '처음 단계로' || option === 5) {
        text = '처음으로 돌아갑니다.';
        create(text, 0, 0, 1)
    }


    return message
}

export default createMessage;