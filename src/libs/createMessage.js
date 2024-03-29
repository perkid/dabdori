import { Keyboard } from 'react-native';
import { callNumber } from './calling';
import axios from 'axios';
import getUrl from '../config/environment';
import { set } from 'react-native-reanimated';


function createMessage(text, option, subOption, item, userInfo, company, messageSend, handleOption, handleSubOption, handleItem, selectCompany, handleCompany, sendPushNotification, handleColor, color, handleItemName, itemName, handlePrice, price, handleQuestion, question, scroll, handleLoading) {

    // option
    // 1: 현물조회
    // 2: 샘플신청
    // 3: 아이템 정보
    // 4: 장바구니
    // 5: 처음으로
    // 6: 문의사항
    // 7: 음성인식
    // 0: 초기화

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
    
    // 콤마 추가
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

    // 숫자 확인
    function numCheck(num){
        let num_check = /^[0-9]*$/;
        let float_check = /^([0-9]*)[\.]?([0-9])?$/;
        if(num_check.test(num) && num !== ''){
            return true
        }
        if(float_check.test(num) && num !== ''){
            return true
        }
        else {
            return false
        }
    }

    const blank_pattern = /[\s]/g;

    const create = (text, option, subOption, quick, item, list, company) => {
        let quickReplies;

        if (quick === 1) {
            (userInfo.role==='employee')?
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
                :
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
                        {
                            title: '문의사항',
                            value: '문의사항',
                        }
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
    if (text === '현물조회' || text === '현물 조회') {
        if (userInfo.role === 'employee') {
            text = `아이템명(또는 아이템 번호)과\n칼라번호 입력\n\n예) ${userInfo.promotion_Item}\n${userInfo.promotion_Color}\n\n(전체 칼라를 원할 경우 아이템\n명만 입력)`;
            option = 1;
            subOption = 1;
            create(text, option, subOption);
        }
        if (userInfo.role === 'client'|| userInfo.role==='partner') {
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
            handleLoading(true)
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
                    handleLoading(false)
                    messageSend(message)
                } else {
                    // axios.post(url + '/api/currentInventory.dab',
                    //     {
                    //         itemName: strArr[0],
                    //         includeYN: 0
                    //     }).then((resoponse) => {
                    //         let r = resoponse.data;

                    //         if (r !== undefined) {
                    //             let lastIndex = r.length - 1;
                    //             text = `${r[0].itemname} (${r[0].itemnocode})\n칼라별 수량\n\n`
                    //             r.map((i, index) => {
                    //                 index === lastIndex ?
                    //                     text += `${i.coloryw}\n${i.jaeqty}YD`
                    //                     :
                    //                     text += `${i.coloryw}\n${i.jaeqty}YD\n\n`
                    //             })

                    //             message = {
                    //                 createdAt: new Date(),
                    //                 _id: Math.round(Math.random() * 1000000),
                    //                 text: text,
                    //                 user: {
                    //                     _id: 2
                    //                 },
                    //                 quickReplies: {
                    //                     type: 'radio',
                    //                     values: [
                    //                         {
                    //                             title: '현물조회',
                    //                             value: '현물조회',
                    //                         },
                    //                         {
                    //                             title: '샘플신청',
                    //                             value: '샘플신청',
                    //                         },
                    //                         {
                    //                             title: '아이템 정보',
                    //                             value: '아이템 정보',
                    //                         },
                    //                     ],
                    //                 },
                    //                 option: 0,
                    //                 subOption: 0,
                    //             }
                    //             handleOption(0)
                    //             handleSubOption(0)
                    //             handleLoading(false)
                    //             messageSend(message)
                    //             Keyboard.dismiss()
                    //             //로그입력
                    //             axios.post(url + `/api/insertLog.dab`, {
                    //                 log_gb: '01',
                    //                 item_code: r[0].itemcode,
                    //                 item_name: r[0].itemname,
                    //                 color_name: '전칼라',
                    //                 user_name: userInfo.user_name,
                    //                 role: userInfo.role,
                    //                 cust_name: userInfo.company_name,
                    //             })
                    //         }
                    //     }).catch((err) => {
                    //         text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
                    //         handleOption(0)
                    //         handleSubOption(0);
                    //         message = {
                    //             createdAt: new Date(),
                    //             _id: Math.round(Math.random() * 1000000),
                    //             text: text,
                    //             user: {
                    //                 _id: 2
                    //             },
                    //             quickReplies: {
                    //                 type: 'radio',
                    //                 values: [
                    //                     {
                    //                         title: '현물조회',
                    //                         value: '현물조회',
                    //                     },
                    //                     {
                    //                         title: '샘플신청',
                    //                         value: '샘플신청',
                    //                     },
                    //                     {
                    //                         title: '아이템 정보',
                    //                         value: '아이템 정보',
                    //                     },
                    //                 ],
                    //             },
                    //             option: 0,
                    //             subOption: 0,
                    //         }
                    //         handleLoading(false)
                    //         messageSend(message)
                    //     })
                    
                    // 용도 선택
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
                    handleLoading(false)
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
                    handleLoading(false)
                    messageSend(message)
            })
        }
        //칼라 번호도 입력한 경우
        if (strArr.length === 2) {
            handleLoading(true)
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
                                handleLoading(false)
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
                                handleLoading(false)
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
                        handleLoading(false)
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
                    handleLoading(false)
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
                    handleLoading(false)
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
        handleLoading(true)
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
                        let gayoung = i.gayoungqty !== '0.00' ? `, 지사 ${i.gayoungqty}YD` : ''
                        let product = i.productqty !== '0.00' ? `, 작업중 ${i.productqty}YD` : ''
                        let jae = parseFloat(i.jaeqty) //- parseFloat(i.holdqty)
                        if(i.jaeqty > 1){
                            index === lastIndex ?

                            text += `${i.coloryw}\n현물 ${jae}YD${gayoung}${product}`
                            :
                            text += `${i.coloryw}\n현물 ${jae}YD${gayoung}${product}\n\n`
                        }
                        if(i.jaeqty < 1 && i.jaeqty >=0){
                            if(i.gayoungqty !== '0.00' || i.productqty !== '0.00'){
                                gayoung = i.gayoungqty !== '0.00' ? `지사 ${i.gayoungqty}YD` : ''
                                product = i.productqty !== '0.00' ? i.gayoungqty !== '0.00' ?`, 작업중 ${i.productqty}YD` : `작업중 ${i.productqty}YD` : ''
                                index === lastIndex ?
                                text += `${i.coloryw}\n${gayoung}${product}`
                                :
                                text += `${i.coloryw}\n${gayoung}${product}\n\n`
                            }
                        }
                        // index === lastIndex ?
                        //     text += `${i.coloryw}\n${i.jaeqty}YD`
                        //     :
                        //     text += `${i.coloryw}\n${i.jaeqty}YD\n\n`
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
                    handleOption(0)
                    handleSubOption(0)
                    handleLoading(false)
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
                handleLoading(false)
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
        handleLoading(true)
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
                        let gayoung = i.gayoungqty!=='0.00' ? `, 지사 ${i.gayoungqty}YD` : ''
                        let product = i.productqty !== '0.00' ? `, 작업중 ${i.productqty}YD` : ''
                        let jae = parseFloat(i.jaeqty) //- parseFloat(i.holdqty)
                        index === lastIndex ?
                            text += `${i.coloryw} (${i.colorname})\n현물 ${jae.toFixed(2)}YD${gayoung}${product}`
                            :
                            text += `${i.coloryw} (${i.colorname})\n현물 ${jae.toFixed(2)}YD${gayoung}${product}\n\n`
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
                    handleOption(0)
                    handleSubOption(0)
                    handleLoading(false)
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
                handleLoading(false)
                messageSend(message)
            })
    }

    if (option === 1 && subOption === 3 && text === '아니요') {
        handleLoading(true)
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
                        let gayoung = i.gayoungqty !== '0.00' ? `, 지사 ${i.gayoungqty}YD` : ''
                        let product = i.productqty !== '0.00' ? `, 작업중 ${i.productqty}YD` : ''
                        let jae = parseFloat(i.jaeqty) //- parseFloat(i.holdqty)
                        if(i.jaeqty > 1){
                            index === lastIndex ?

                            text += `${i.coloryw} (${i.colorname})\n현물 ${jae.toFixed(2)}YD${gayoung}${product}`
                            :
                            text += `${i.coloryw} (${i.colorname})\n현물 ${jae.toFixed(2)}YD${gayoung}${product}\n\n`
                        }
                        if(i.jaeqty < 1 && i.jaeqty >=0){
                            if(i.gayoungqty !== '0.00' || i.productqty !== '0.00'){
                                gayoung = i.gayoungqty !== '0.00' ? `지사 ${i.gayoungqty}YD` : ''
                                product = i.productqty !== '0.00' ? i.gayoungqty !== '0.00' ?`, 작업중 ${i.productqty}YD` : `작업중 ${i.productqty}YD` : ''
                                index === lastIndex ?
                                text += `${i.coloryw} (${i.colorname})\n${gayoung}${product}`
                                :
                                text += `${i.coloryw} (${i.colorname})\n${gayoung}${product}\n\n`
                            }
                        }
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
                    handleOption(0)
                    handleSubOption(0)
                    handleLoading(false)
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
                handleLoading(false)
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
        handleLoading(true)
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
                    handleLoading(false)
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
                    handleLoading(false)
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
                            {
                                title: '문의사항',
                                value: '문의사항',
                            }
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                handleLoading(false)
                messageSend(message)
            })
        Keyboard.dismiss()
    }
    let passText = ['전체 컬러', '전체컬러']
    if(option ===1 && subOption === 5 && passText.includes(text)){
        handleLoading(true)
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
                        let gayoung = i.gayoungqty !== '0.00' ? `, 지사 ${i.gayoungqty}YD` : ''
                        let product = i.productqty !== '0.00' ? `, 작업중 ${i.productqty}YD` : ''
                        let jae = parseFloat(i.jaeqty) //- parseFloat(i.holdqty)
                        if(i.jaeqty > 1){
                            index === lastIndex ?

                            text += `${i.coloryw}\n현물 ${jae.toFixed(2)}YD${gayoung}${product}`
                            :
                            text += `${i.coloryw}\n현물 ${jae.toFixed(2)}YD${gayoung}${product}\n\n`
                        }
                        if(i.jaeqty < 1 && i.jaeqty >=0){
                            if(i.gayoungqty !== '0.00' || i.productqty !== '0.00'){
                                gayoung = i.gayoungqty !== '0.00' ? `지사 ${i.gayoungqty}YD` : ''
                                product = i.productqty !== '0.00' ? i.gayoungqty !== '0.00' ?`, 작업중 ${i.productqty}YD` : `작업중 ${i.productqty}YD` : ''
                                index === lastIndex ?
                                text += `${i.coloryw}\n${gayoung}${product}`
                                :
                                text += `${i.coloryw}\n${gayoung}${product}\n\n`
                            }
                        }
                        // index === lastIndex ?
                        //     text += `${i.coloryw}\n${i.jaeqty}YD`
                        //     :
                        //     text += `${i.coloryw}\n${i.jaeqty}YD\n\n`
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
                                {
                                    title: '문의사항',
                                    value: '문의사항',
                                }
                            ],
                        },
                        option: 0,
                        subOption: 0,
                    }
                    handleOption(0)
                    handleSubOption(0)
                    handleLoading(false)
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
                            {
                                title: '문의사항',
                                value: '문의사항',
                            }
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                handleLoading(false)
                messageSend(message)
            })
        Keyboard.dismiss()
    }

    if (option === 1 && subOption === 5 && text !=='전체컬러' && text.length < 15) {
        let color = text;
        scroll()
        handleLoading(true);
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

                            // 대체 아이템 조회
                            let replaceItemList = '';

                            axios.post(url + '/api/ReplaceItemList.dab', {
                                item_name: item,
                            }).then((response) => {

                                let replaceItem = response.data;

                                if(replaceItem.length > 0){
                                    
                                    let re = [];
                                    let si = [];

                                    replaceItem.forEach(item =>{
                                        if(item.replace_gb === 'R'){
                                            re.push(item.replace_item)
                                        }
                                        if(item.replace_gb === 'S'){
                                            si.push(item.replace_item)
                                        }
                                    })
                                    if(re.length>0){
                                        replaceItemList += `대체 아이템은 "`

                                        let setReList = new Set(re)
                                        let uniqueReList = [...setReList]
                                        
                                        uniqueReList.forEach((item, i) => {
                                            if(uniqueReList.length !== i+1){
                                                replaceItemList += `${item}, `
                                            }
                                            else{
                                                replaceItemList += si.length > 0 ? `${item}"\n` : `${item}" 입니다.`
                                            }
                                        })
                                    }
                                    if(si.length>0){

                                        replaceItemList += `유사 아이템은 "`

                                        let setSiList = new Set(si)
                                        let uniqueSiList = [...setSiList]
                                        uniqueSiList.forEach((item, i) => {
                                            if(uniqueSiList.length !== i+1){
                                                replaceItemList += `${item}, `
                                            }
                                            else{
                                                replaceItemList += `${item}" 입니다.`
                                            }
                                        })
                                    }
                                }

                                if(colorList.length===0){
                                    // 유사컬러, 대체아이템도 없는경우
                                    if(replaceItemList === ''){
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
                                        handleOption(0)
                                        handleSubOption(0)
                                        handleLoading(false)
                                        messageSend(message)
                                    }
                                    else {
                                        // 유사칼라만 없는 경우
                                        message = {
                                            createdAt: new Date(),
                                            _id: Math.round(Math.random() * 1000000),
                                            text: `현재 ${r[0].itemname}의 ${r[0].coloryw} 칼라는\n재고가 없습니다.\n\n`+replaceItemList +'\n위 아이템을 검색해보시길 추천드립니다.',
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
                                        handleOption(0)
                                        handleSubOption(0)
                                        handleLoading(false)
                                        messageSend(message)
                                    }
                                }
                                // 유사칼라가 있는 경우
                                if(colorList.length>0){
                                    // 대체아이템이 없는 경우
                                    if(replaceItemList === ''){
                                        let rcText='';
                                        colorList.forEach(item=> rcText += `${item.coloryw} (${item.jaeqty})YD\n`)
                                        message = {
                                            createdAt: new Date(),
                                            _id: Math.round(Math.random() * 1000000),
                                            text: `현재 ${r[0].itemname}의 ${r[0].coloryw} 칼라는\n재고가 없습니다.\n\n유사한 칼라(재고)는\n${rcText}입니다.`,
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
                                        handleOption(0)
                                        handleSubOption(0)
                                        handleLoading(false)
                                        messageSend(message)
                                    }
                                    // 대체 아이템이 있는경우
                                    else {
                                        let rcText='';
                                        colorList.forEach(item=> rcText += `${item.coloryw} (${item.jaeqty})YD\n`)
                                        message = {
                                            createdAt: new Date(),
                                            _id: Math.round(Math.random() * 1000000),
                                            text: `현재 ${r[0].itemname}의 ${r[0].coloryw} 칼라는\n재고가 없습니다.\n\n유사한 칼라(재고)는\n${rcText}\n`+replaceItemList +'\n위 아이템을 검색해보시길 추천드립니다.',
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
                                        handleOption(0)
                                        handleSubOption(0)
                                        handleLoading(false)
                                        messageSend(message)
                                    }
                                }
                            })
                        } else {
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
                                            title: '대체 아이템',
                                            value: '대체 아이템',
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
                            handleOption(0)
                            handleSubOption(0)
                            handleItemName(item)
                            handleColor(color)
                            handleLoading(false)
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
                            {
                                title: '문의사항',
                                value: '문의사항',
                            }
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                handleLoading(false)
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
        handleLoading(true)
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
                    handleLoading(false)
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
                            {
                                title: '문의사항',
                                value: '문의사항',
                            }
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                handleLoading(false)
                messageSend(message)
            })
        Keyboard.dismiss()
    }

    if (text === '대체 아이템') {
        handleLoading(true);
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
                            let similarColor = color.substring(0,3)
                            let recommend = res.filter(item=> item.coloryw.includes(similarColor))
                            let colorList =[];

                            recommend.forEach(item => {
                                if(item.jaeqty>0){
                                    colorList.push({coloryw:item.coloryw,jaeqty:item.jaeqty})
                                }
                            })

                            // 대체 아이템 조회
                            let replaceItemList = '';

                            axios.post(url + '/api/ReplaceItemList.dab', {
                                item_name: item,
                            }).then((response) => {

                                let replaceItem = response.data;

                                if(replaceItem.length > 0){
                                    
                                    let re = [];
                                    let si = [];

                                    replaceItem.forEach(item =>{
                                        if(item.replace_gb === 'R'){
                                            re.push(item.replace_item)
                                        }
                                        if(item.replace_gb === 'S'){
                                            si.push(item.replace_item)
                                        }
                                    })
                                    if(re.length>0){
                                        replaceItemList += `대체 아이템은 "`

                                        let setReList = new Set(re)
                                        let uniqueReList = [...setReList]
                                        
                                        uniqueReList.forEach((item, i) => {
                                            if(uniqueReList.length !== i+1){
                                                replaceItemList += `${item}, `
                                            }
                                            else{
                                                replaceItemList += si.length > 0 ? `${item}"\n` : `${item}" 입니다.`
                                            }
                                        })
                                    }
                                    if(si.length>0){

                                        replaceItemList += `유사 아이템은 "`

                                        let setSiList = new Set(si)
                                        let uniqueSiList = [...setSiList]
                                        uniqueSiList.forEach((item, i) => {
                                            if(uniqueSiList.length !== i+1){
                                                replaceItemList += `${item}, `
                                            }
                                            else{
                                                replaceItemList += `${item}" 입니다.`
                                            }
                                        })
                                    }
                                }

                                // if(colorList.length===0){
                                //     // 유사컬러, 대체아이템도 없는경우
                                //     if(replaceItemList === ''){
                                //         message = {
                                //             createdAt: new Date(),
                                //             _id: Math.round(Math.random() * 1000000),
                                //             text: `${r[0].itemname}\n${r[0].coloryw}\n\n현물없음`,
                                //             user: {
                                //                 _id: 2
                                //             },
                                //             quickReplies: {
                                //                 type: 'radio',
                                //                 values: [
                                //                     {
                                //                         title: '빠른수배 요청',
                                //                         value: '빠른수배 요청',
                                //                     },
                                //                     {
                                //                         title: '샘플신청',
                                //                         value: '샘플신청',
                                //                     },
                                //                     {
                                //                         title: '다시 선택',
                                //                         value: '다시 선택',
                                //                     },
                                //                     {
                                //                         title: '처음 단계로',
                                //                         value: '처음 단계로',
                                //                     },
                                //                 ],
                                //             },
                                //             option: 0,
                                //             subOption: 0,
                                //         }
                                //         handleOption(0)
                                //         handleSubOption(0)
                                //         handleLoading(false)
                                //         messageSend(message)
                                //     }
                                //     else {
                                //         // 유사칼라만 없는 경우
                                //         message = {
                                //             createdAt: new Date(),
                                //             _id: Math.round(Math.random() * 1000000),
                                //             text: `현재 ${r[0].itemname}의 ${r[0].coloryw} 칼라는\n재고가 없습니다.\n\n`+replaceItemList +'\n위 아이템을 검색해보시길 추천드립니다.',
                                //             user: {
                                //                 _id: 2
                                //             },
                                //             quickReplies: {
                                //                 type: 'radio',
                                //                 values: [
                                //                     {
                                //                         title: '빠른수배 요청',
                                //                         value: '빠른수배 요청',
                                //                     },
                                //                     {
                                //                         title: '샘플신청',
                                //                         value: '샘플신청',
                                //                     },
                                //                     {
                                //                         title: '다시 선택',
                                //                         value: '다시 선택',
                                //                     },
                                //                     {
                                //                         title: '처음 단계로',
                                //                         value: '처음 단계로',
                                //                     },
                                //                 ],
                                //             },
                                //             option: 0,
                                //             subOption: 0,
                                //         }
                                //         handleOption(0)
                                //         handleSubOption(0)
                                //         handleLoading(false)
                                //         messageSend(message)
                                //     }
                                // }

                                // 유사칼라가 있는 경우
                                if(colorList.length>0){
                                    // 대체아이템이 없는 경우
                                    if(replaceItemList === ''){
                                        let rcText='';
                                        colorList.forEach(item=> rcText += `${item.coloryw} (${item.jaeqty})YD\n`)
                                        message = {
                                            createdAt: new Date(),
                                            _id: Math.round(Math.random() * 1000000),
                                            text: `해당 아이템은 대체 아이템 및 유사 아이템이 없습니다.`,
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
                                        handleOption(0)
                                        handleSubOption(0)
                                        handleLoading(false)
                                        messageSend(message)
                                    }
                                    // 대체 아이템이 있는경우
                                    else {
                                        let rcText='';
                                        colorList.forEach(item=> rcText += `${item.coloryw} (${item.jaeqty})YD\n`)
                                        message = {
                                            createdAt: new Date(),
                                            _id: Math.round(Math.random() * 1000000),
                                            text: `${r[0].itemname}의\n`+replaceItemList,
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
                                        handleOption(0)
                                        handleSubOption(0)
                                        handleLoading(false)
                                        messageSend(message)
                                    }
                                }
                            })
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
                            {
                                title: '문의사항',
                                value: '문의사항',
                            }
                        ],
                    },
                    option: 0,
                    subOption: 0,
                }
                handleLoading(false)
                messageSend(message)
            })
    }

    // 샘플신청
    if (text === '샘플신청' || text === '샘플 신청') {
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

    let passOp = [2,7]
    if (passOp.includes(option) && subOption === 2 && company !=='스펙정보') {
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
        handleLoading(true)
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
                    handleLoading(false)
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
                    handleLoading(false)
                    messageSend(message)
                    handleCompany(companyList)
                    selectCompany(companyList)
                    Keyboard.dismiss()
                }
                if (companyList.length === 0) {
                    handleOption(2);
                    handleSubOption(1);
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
                    handleLoading(false)
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
                handleLoading(false)
                messageSend(message)
            })
    }

    if (passOp.includes(option) && subOption === 3 && !text.includes('원하시는')) {
        let st = text.split(' ')
        let textArr = text.split('\n');
        let itemList = [];
        if(st.length>4){
            let itemCount
            if(textArr.length===1){
                let chk = Number(st[3].replace(/[^\d.-]/g,''))
                if(chk === 0){
                    itemCount = parseInt(st.length/3)
                    for (let k = 0; k < itemCount; k++) {
                        let item = ''
                        item += st[k*3+0]
                        item += ' ' + st[k*3+1].replace(',','')
                        item += ' ' + st[k*3+2].replace(/[^\d.-]/g,'')
                        if(!itemList.includes(item)){
                            itemList.push(item)
                        }
                        textArr = itemList
                    }
                }
                if(chk !== 0){
                    itemCount = parseInt(st.length/4)
                    for (let k = 0; k < itemCount; k++) {
                        let item = ''
                        item += st[k*4+0]
                        item += ' ' + st[k*4+1].replace(',','')
                        item += ' ' + st[k*4+2].replace(/[^\d.-]/g,'')
                        item += ' ' + st[k*4+3].replace(/[^\d.-]/g,'')
                        if(!itemList.includes(item)){
                            itemList.push(item)
                        }
                        textArr = itemList
                    }
                }
                
            }
        }
        if(st.length<3){
            text = `잘못 입력 하셨습니다. 다시 입력해 주세요.`
            create(text, 2, 2)
            textArr = false;
        }
        if(st.length>3){
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
                let qty = Number(strArr[2].replace(/[^\d.-]/g,''));
    
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
        }
        

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
                handleLoading(true)
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
                                        item.amount = strArr[2].replace(/[^\d.-]/g,'')
                                        if (strArr[3] !== undefined) {
                                            item.price = toCommaStringF(strArr[3].replace(/[^\d.-]/g,''))
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
                                                handleLoading(false)
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
                                                        },
                                                        // {
                                                        //     title: '거래처(택배)',
                                                        //     value: '거래처(택배)'
                                                        // }
                                                    ],
                                                },
                                                option: 2,
                                                subOption: 4,
                                                item: itemList
                                            }
                                            handleLoading(false)
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
                                        handleLoading(false)
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
                                    handleLoading(false)
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
                            handleLoading(false)
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
                        handleLoading(false)
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
                handleLoading(true)
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
                                                handleLoading(false)
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
                                                        },
                                                        // {
                                                        //     title: '거래처(택배)',
                                                        //     value: '거래처(택배)'
                                                        // }
                                                    ],
                                                },
                                                option: 2,
                                                subOption: 4,
                                                item: itemList
                                            }
                                            handleLoading(false)
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
                                        handleLoading(false)
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
                                    handleLoading(false)
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
                            handleLoading(false)
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
                        handleLoading(false)
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
        if (method === '거래처(택배)'){
            order.delyDate = `${year}-${month}-${day}`;
            order.deli_type = 30;
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
        handleLoading(true)
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
                handleLoading(false)
                if(userInfo.role==='employee'){
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
                }
                if(userInfo.role!=='employee'){
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
                                {
                                    title: '문의사항',
                                    value: '문의사항',
                                }
                            ],
                        },
                        option: 0,
                        subOption: 0,
                    }
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
                if(userInfo.role!=='employee'){
                    let pushToken = userInfo.manager_firebase_token;
                    sendPushNotification(pushToken,'신규오더',`${userInfo.company_name} 오더 단가를 확정해주세요.`)
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
                handleLoading(false)
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
                handleLoading(false)
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
        handleLoading(true)
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

                if(userInfo.role==='employee'){
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
                }
                if(userInfo.role!=='employee'){
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
                                {
                                    title: '문의사항',
                                    value: '문의사항',
                                }
                            ],
                        },
                        option: 0,
                        subOption: 0,
                    }
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
                if(userInfo.role!=='employee'){
                    let pushToken = userInfo.manager_firebase_token;
                    sendPushNotification(pushToken,'신규오더',`${userInfo.company_name} 오더 단가를 확정해주세요.`)
                }
                handleLoading(false)
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
                handleLoading(false)
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
                handleLoading(false)
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
    if (text === '아이템 정보' || text === '아이템정보') {
        text = '정보 조회를 원하는 아이템명을\n입력해주세요.';
        option = 3;
        subOption = 1;
        create(text, option, subOption)
    }

    if (option === 3 && subOption === 1 && userInfo.role === 'client' && text.length < 10) {
        text = text.replace(/ /g,"")
        handleLoading(true)
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
                let itemName = spec.itemName;
                let itemNo = spec.itemNo;
                let price = spec.price.split('.')
                let check = spec.dry_friction===null

                
                text = `${itemName}(${itemNo}) 스펙\n\n염색 : ${spec.dyeingGbn}\n혼용률 : ${spec.composition}\n사용폭 : ${spec.width}±2%,   중량 : ${spec.weight} g/yd\n조직도 : ${spec.organization},   후가공 : ${spec.finish}\n${userInfo.access_level==='3'?`\n단가 : ${spec.priceC}원\n`:''}\n${userInfo.specGB==='Y'?`경사사종/번수\n - ${spec.ksajong}\n위사사종/번수\n - ${spec.wsajong}\n경사밀도 : ${spec.kdensity}\n위사밀도 : ${spec.wdensity}\n\n`:''}${check?'':`*견뢰도*\n건마찰 : ${spec.dry_friction},     습마찰 : ${spec.swrat_friction}\n세   탁 : ${spec.cleaning},     드라이 : ${spec.dry}\n땀 : ${spec.sweat}`}${userInfo.priceGB==='Y'?`\n\n매입단가\n${spec.custName} : ${price[0]}원`:''}`
                
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
                            {
                                title: '문의사항',
                                value: '문의사항',
                            }
                        ],
                    },
                    option: 0,
                    subOption: 0
                }
                handleLoading(false)
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
                handleLoading(false)
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
                    handleLoading(false)
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
                handleLoading(false)
                messageSend(message)
        })
    }
    if (option === 3 && subOption === 1 && userInfo.role === 'partner' && text.length < 10) {
        text = text.replace(/ /g,"")
        handleLoading(true)
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
                let itemName = spec.itemName;
                let itemNo = spec.itemNo;
                let price = spec.price.split('.')
                let check = spec.dry_friction===null
                text = `${itemName}(${itemNo}) 스펙\n\n염색 : ${spec.dyeingGbn}\n혼용률 : ${spec.composition}\n사용폭 : ${spec.width}±2%,   중량 : ${spec.weight} g/yd\n조직도 : ${spec.organization},   후가공 : ${spec.finish}\n${userInfo.access_level==='3'?`\n단가 : ${spec.priceC}원\n`:''}\n${userInfo.specGB==='Y'?`경사사종/번수\n - ${spec.ksajong}\n위사사종/번수\n - ${spec.wsajong}\n경사밀도 : ${spec.kdensity}\n위사밀도 : ${spec.wdensity}\n\n`:''}${check?'':`*견뢰도*\n건마찰 : ${spec.dry_friction},     습마찰 : ${spec.swrat_friction}\n세   탁 : ${spec.cleaning},     드라이 : ${spec.dry}\n땀 : ${spec.sweat}`}${userInfo.priceGB==='Y'?`\n\n매입단가\n${spec.custName} : ${price[0]}원`:''}`
                
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
                            {
                                title: '문의사항',
                                value: '문의사항',
                            }
                        ],
                    },
                    option: 0,
                    subOption: 0
                }
                handleLoading(false)
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
                handleLoading(false)
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
                    handleLoading(false)
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
                handleLoading(false)
                messageSend(message)
        })
    }

    if (option === 3 && subOption === 1 && userInfo.role === 'employee' && text.length < 10) {
        text = text.replace(/ /g,"")
        handleLoading(true)
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
                handleLoading(false)
                messageSend(message)
            } else {
                let item = text;
                text = '조회 항목을 선택해 주세요.';
                quick = 2;
                handleOption(0)
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
                    handleLoading(false)
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
                handleLoading(false)
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
                    handleLoading(false)
                    messageSend(message)
                }
            })
    }
    
    if (text === '업차지' && subOption === 2) {
        handleLoading(true)
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
                let custName = spec.custName

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
                    option: 0,
                    subOption: 2
                }
                handleOption(0)
                handleSubOption(2)
                handleLoading(false)
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
                handleLoading(false)
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
            handleLoading(false)
            messageSend(message)
        })
    }

    if (text === '스펙과 단가' && subOption === 2) {
        handleLoading(true)
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
                let itemName = spec.itemName
                let itemNo = spec.itemNo;
                let price = spec.price.split('.');
                let check = spec.dry_friction===null

                text = `${itemName}(${itemNo}) 스펙\n\n염색 : ${spec.dyeingGbn}\n혼용률 : ${spec.composition}\n사용폭 : ${spec.width}±2%,   중량 : ${spec.weight} g/yd\n조직도 : ${spec.organization},   후가공 : ${spec.finish}\n${userInfo.access_level==='3'?`\n단가 : ${spec.priceC}원\n`:''}${userInfo.specGB==='Y'?`\n경사사종/번수\n - ${spec.ksajong}\n위사사종/번수\n - ${spec.wsajong}\n경사밀도 : ${spec.kdensity}\n위사밀도 : ${spec.wdensity}\n\n`:''}${check?'':`*견뢰도*\n건마찰 : ${spec.dry_friction},     습마찰 : ${spec.swrat_friction}\n세   탁 : ${spec.cleaning},     드라이 : ${spec.dry}\n땀 : ${spec.sweat}`}${userInfo.priceGB==='Y'?`\n\n매입단가\n${spec.custName} : ${price[0]}원`:''}`

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
                    option: 0,
                    subOption: 2
                }

                handleOption(0)
                handleSubOption(2)
                handleLoading(false)
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
                handleLoading(false)
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
            handleLoading(false)
            messageSend(message)
        })
    }

    let passList = ['업차지','스펙과 단가','다른 아이템 조회','처음 단계로'];

    // 바로 조회하는 부분
    // if(option === 3 && subOption === 2 && !passList.includes(text) && text.length < 10){
    //     if(userInfo.role === 'client'){
    //         handleLoading(true)
    //         axios.post(url + `/api/searchItem.dab`,
    //             {
    //                 itemName: text
    //             }).then((response) => {
    //                 let itemCode = response.data.itemCode;
    //                 axios.post(url + `/api/itemSpecInfo.dab`,
    //                     {
    //                         itemCode: itemCode
    //                     }
    //                 ).then((response) => {
    //                     let spec = response.data;

    //                     let price = spec.price.split('.')
    //                     let check = spec.dry_friction === null
    //                     text = `${text} 스펙\n\n염색 : ${spec.dyeingGbn}\n혼용률 : ${spec.composition}\n사용폭 : ${spec.width}±2%,   중량 : ${spec.weight} g/yd\n조직도 : ${spec.organization},   후가공 : ${spec.finish}\n${userInfo.access_level === '3' ? `\n단가 : ${spec.priceC}원\n` : ''}\n${userInfo.specGB === 'Y' ? `경사사종/번수\n - ${spec.ksajong}\n위사사종/번수\n - ${spec.wsajong}\n경사밀도 : ${spec.kdensity}\n위사밀도 : ${spec.wdensity}\n\n` : ''}${check ? '' : `*견뢰도*\n건마찰 : ${spec.dry_friction},     습마찰 : ${spec.swrat_friction}\n세   탁 : ${spec.cleaning},     드라이 : ${spec.dry}\n땀 : ${spec.sweat}`}${userInfo.priceGB === 'Y' ? `\n\n매입단가\n${spec.custName} : ${price[0]}원` : ''}`

    //                     handleOption(0)
    //                     handleSubOption(0)
    //                     message = {
    //                         createdAt: new Date(),
    //                         _id: Math.round(Math.random() * 1000000),
    //                         text: text,
    //                         user: {
    //                             _id: 2
    //                         },
    //                         quickReplies: {
    //                             type: 'radio',
    //                             values: [
    //                                 {
    //                                     title: '현물조회',
    //                                     value: '현물조회',
    //                                 },
    //                                 {
    //                                     title: '샘플신청',
    //                                     value: '샘플신청',
    //                                 },
    //                                 {
    //                                     title: '아이템 정보',
    //                                     value: '아이템 정보',
    //                                 },
    //                                 {
    //                                     title: '문의사항',
    //                                     value: '문의사항',
    //                                 }
    //                             ],
    //                         },
    //                         option: 0,
    //                         subOption: 0
    //                     }
    //                     handleLoading(false)
    //                     messageSend(message)
    //                     Keyboard.dismiss()
    //                     //로그입력
    //                     axios.post(url + `/api/insertLog.dab`, {
    //                         log_gb: '03',
    //                         item_code: itemCode,
    //                         item_name: response.data.itemName,
    //                         user_name: userInfo.user_name,
    //                         role: userInfo.role,
    //                         cust_name: userInfo.company_name
    //                     })
    //                 }).catch((err) => {
    //                     if (err.message.includes('spec.prodList[0]')) {
    //                         text = `${text}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`;
    //                         handleOption(3)
    //                         handleSubOption(1);
    //                         message = {
    //                             createdAt: new Date(),
    //                             _id: Math.round(Math.random() * 1000000),
    //                             text: text,
    //                             user: {
    //                                 _id: 2
    //                             },
    //                             option: 3,
    //                             subOption: 1,
    //                         }
    //                         handleLoading(false)
    //                         messageSend(message)
    //                     } else {
    //                         text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
    //                         handleOption(0)
    //                         handleSubOption(0);
    //                         message = {
    //                             createdAt: new Date(),
    //                             _id: Math.round(Math.random() * 1000000),
    //                             text: text,
    //                             user: {
    //                                 _id: 2
    //                             },
    //                             quickReplies: {
    //                                 type: 'radio',
    //                                 values: [
    //                                     {
    //                                         title: '현물조회',
    //                                         value: '현물조회',
    //                                     },
    //                                     {
    //                                         title: '샘플신청',
    //                                         value: '샘플신청',
    //                                     },
    //                                     {
    //                                         title: '아이템 정보',
    //                                         value: '아이템 정보',
    //                                     },
    //                                 ],
    //                             },
    //                             option: 0,
    //                             subOption: 0,
    //                         }
    //                         handleLoading(false)
    //                         messageSend(message)
    //                     }
    //                 })
    //             }).catch((err) => {
    //                 text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
    //                 handleOption(0)
    //                 handleSubOption(0);
    //                 message = {
    //                     createdAt: new Date(),
    //                     _id: Math.round(Math.random() * 1000000),
    //                     text: text,
    //                     user: {
    //                         _id: 2
    //                     },
    //                     quickReplies: {
    //                         type: 'radio',
    //                         values: [
    //                             {
    //                                 title: '현물조회',
    //                                 value: '현물조회',
    //                             },
    //                             {
    //                                 title: '샘플신청',
    //                                 value: '샘플신청',
    //                             },
    //                             {
    //                                 title: '아이템 정보',
    //                                 value: '아이템 정보',
    //                             },
    //                         ],
    //                     },
    //                     option: 0,
    //                     subOption: 0,
    //                 }
    //                 handleLoading(false)
    //                 messageSend(message)
    //             })
    //     }
    //     if (userInfo.role === 'partner') {
    //         handleLoading(true)
    //         axios.post(url + `/api/searchItem.dab`,
    //             {
    //                 itemName: text
    //             }).then((response) => {
    //                 let itemCode = response.data.itemCode;
    //                 axios.post(url + `/api/itemSpecInfo.dab`,
    //                     {
    //                         itemCode: itemCode
    //                     }
    //                 ).then((response) => {
    //                     let spec = response.data;

    //                     let price = spec.price.split('.')
    //                     let check = spec.dry_friction === null
    //                     text = `${text} 스펙\n\n염색 : ${spec.dyeingGbn}\n혼용률 : ${spec.composition}\n사용폭 : ${spec.width}±2%,   중량 : ${spec.weight} g/yd\n조직도 : ${spec.organization},   후가공 : ${spec.finish}\n${userInfo.access_level === '3' ? `\n단가 : ${spec.priceC}원\n` : ''}\n${userInfo.specGB === 'Y' ? `경사사종/번수\n - ${spec.ksajong}\n위사사종/번수\n - ${spec.wsajong}\n경사밀도 : ${spec.kdensity}\n위사밀도 : ${spec.wdensity}\n\n` : ''}${check ? '' : `*견뢰도*\n건마찰 : ${spec.dry_friction},     습마찰 : ${spec.swrat_friction}\n세   탁 : ${spec.cleaning},     드라이 : ${spec.dry}\n땀 : ${spec.sweat}`}${userInfo.priceGB === 'Y' ? `\n\n매입단가\n${spec.custName} : ${price[0]}원` : ''}`

    //                     handleOption(0)
    //                     handleSubOption(0)
    //                     message = {
    //                         createdAt: new Date(),
    //                         _id: Math.round(Math.random() * 1000000),
    //                         text: text,
    //                         user: {
    //                             _id: 2
    //                         },
    //                         quickReplies: {
    //                             type: 'radio',
    //                             values: [
    //                                 {
    //                                     title: '현물조회',
    //                                     value: '현물조회',
    //                                 },
    //                                 {
    //                                     title: '샘플신청',
    //                                     value: '샘플신청',
    //                                 },
    //                                 {
    //                                     title: '아이템 정보',
    //                                     value: '아이템 정보',
    //                                 },
    //                                 {
    //                                     title: '문의사항',
    //                                     value: '문의사항',
    //                                 }
    //                             ],
    //                         },
    //                         option: 0,
    //                         subOption: 0
    //                     }
    //                     handleLoading(false)
    //                     messageSend(message)
    //                     Keyboard.dismiss()
    //                     //로그입력
    //                     axios.post(url + `/api/insertLog.dab`, {
    //                         log_gb: '03',
    //                         item_code: itemCode,
    //                         item_name: response.data.itemName,
    //                         user_name: userInfo.user_name,
    //                         role: userInfo.role,
    //                         cust_name: userInfo.company_name
    //                     })
    //                 }).catch((err) => {
    //                     if (err.message.includes('spec.prodList[0]')) {
    //                         text = `${text}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`;
    //                         handleOption(3)
    //                         handleSubOption(1);
    //                         message = {
    //                             createdAt: new Date(),
    //                             _id: Math.round(Math.random() * 1000000),
    //                             text: text,
    //                             user: {
    //                                 _id: 2
    //                             },
    //                             option: 3,
    //                             subOption: 1,
    //                         }
    //                         handleLoading(false)
    //                         messageSend(message)
    //                     } else {
    //                         text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
    //                         handleOption(0)
    //                         handleSubOption(0);
    //                         message = {
    //                             createdAt: new Date(),
    //                             _id: Math.round(Math.random() * 1000000),
    //                             text: text,
    //                             user: {
    //                                 _id: 2
    //                             },
    //                             quickReplies: {
    //                                 type: 'radio',
    //                                 values: [
    //                                     {
    //                                         title: '현물조회',
    //                                         value: '현물조회',
    //                                     },
    //                                     {
    //                                         title: '샘플신청',
    //                                         value: '샘플신청',
    //                                     },
    //                                     {
    //                                         title: '아이템 정보',
    //                                         value: '아이템 정보',
    //                                     },
    //                                 ],
    //                             },
    //                             option: 0,
    //                             subOption: 0,
    //                         }
    //                         handleLoading(false)
    //                         messageSend(message)
    //                     }
    //                 })
    //             }).catch((err) => {
    //                 text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
    //                 handleOption(0)
    //                 handleSubOption(0);
    //                 message = {
    //                     createdAt: new Date(),
    //                     _id: Math.round(Math.random() * 1000000),
    //                     text: text,
    //                     user: {
    //                         _id: 2
    //                     },
    //                     quickReplies: {
    //                         type: 'radio',
    //                         values: [
    //                             {
    //                                 title: '현물조회',
    //                                 value: '현물조회',
    //                             },
    //                             {
    //                                 title: '샘플신청',
    //                                 value: '샘플신청',
    //                             },
    //                             {
    //                                 title: '아이템 정보',
    //                                 value: '아이템 정보',
    //                             },
    //                         ],
    //                     },
    //                     option: 0,
    //                     subOption: 0,
    //                 }
    //                 handleLoading(false)
    //                 messageSend(message)
    //             })
    //     }
    //     if(userInfo.role === 'employee'){
    //         handleLoading(true)
    //         axios.post(url+`/api/searchItem.dab`,
    //     {
    //             itemName:text
    //     }).then((response)=>{

    //         if(response.data.itemName===null){
    //             text = `${text}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`;
    //             handleOption(3)
    //             handleSubOption(1);
    //             message = {
    //                 createdAt: new Date(),
    //                 _id: Math.round(Math.random() * 1000000),
    //                 text: text,
    //                 user: {
    //                     _id: 2
    //                 },
    //                 option: 3,
    //                 subOption: 1,
    //             }
    //             handleLoading(false)
    //             messageSend(message)
    //         } else {
    //             let item = text;
    //             text = '조회 항목을 선택해 주세요.';
    //             quick = 2;
    //             handleOption(3)
    //             handleSubOption(2);
    //             handleItem(item)
    //             message = {
    //                     createdAt: new Date(),
    //                     _id: Math.round(Math.random() * 1000000),
    //                     text: text,
    //                     user: {
    //                         _id: 2
    //                     },
    //                     quickReplies: {
    //                         type: 'radio',
    //                         values: [
    //                             {
    //                                 title: '업차지',
    //                                 value: '업차지',
    //                             },
    //                             {
    //                                 title: '스펙과 단가',
    //                                 value: '스펙과 단가',
    //                             },
    //                             {
    //                                 title: '다른 아이템 조회',
    //                                 value: '다른 아이템 조회'
    //                             },
    //                             {
    //                                 title: '처음 단계로',
    //                                 value: '처음 단계로',
    //                             },
    //                         ],
    //                     },
    //                     option: 3,
    //                     subOption: 2,
    //                     item:item
    //                 }
    //                 handleLoading(false)
    //                 messageSend(message)
               
    //                 Keyboard.dismiss()
    //         }
            
    //         }).catch((err)=>{
    //             if(err.message.includes('spec.prodList[0]')){
    //                 text = `${text}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`;
    //             handleOption(3)
    //             handleSubOption(1);
    //             message = {
    //                 createdAt: new Date(),
    //                 _id: Math.round(Math.random() * 1000000),
    //                 text: text,
    //                 user: {
    //                     _id: 2
    //                 },
    //                 option: 3,
    //                 subOption: 1,
    //             }
    //             handleLoading(false)
    //             messageSend(message)
    //             } else{
    //                 text = '문제가 발생하였습니다. 담당자에게 문의하세요.';
    //                 handleOption(0)
    //                 handleSubOption(0);
    //                 message = {
    //                     createdAt: new Date(),
    //                     _id: Math.round(Math.random() * 1000000),
    //                     text: text,
    //                     user: {
    //                         _id: 2
    //                     },
    //                     quickReplies : {
    //                         type: 'radio',
    //                         values: [
    //                             {
    //                                 title: '현물조회',
    //                                 value: '현물조회',
    //                             },
    //                             {
    //                                 title: '샘플신청',
    //                                 value: '샘플신청',
    //                             },
    //                             {
    //                                 title: '아이템 정보',
    //                                 value: '아이템 정보',
    //                             },
    //                         ],
    //                     },
    //                     option: 0,
    //                     subOption: 0,
    //                 }
    //                 handleLoading(false)
    //                 messageSend(message)
    //             }
    //         })
    //     }
    // }
    if(text === '다른 아이템 조회'){
        text = '정보 조회를 원하는 아이템명을\n입력해주세요.';
        option = 3;
        subOption = 1;
        create(text, option, subOption)
    }

    if (option === 4 && subOption ===1 && !text.includes('원하시는') && text.length < 15){
        price = price.replace(',','')
        handleLoading(true)
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
                        {
                            title: '문의사항',
                            value: '문의사항',
                        }
                    ],
                },
                option: 0,
                subOption: 0,
            }
            handleLoading(false)
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
                handleLoading(false)
                messageSend(message)
        })
    }
    // if(text === '푸시 테스트'){
    //     let pushToken = 'ExponentPushToken[fBVtqiPHhGeY2EvqUXHBkl]';
    //     sendPushNotification(pushToken,`푸시테스트`)
    //     text = '푸시를 보내고처음으로 돌아갑니다.';
    //     create(text, 0, 0, 1)
    // }

    // 문의사항
    if(text === '문의사항'){
        text= '문의사항을 입력해주세요.';
        option = 6;
        subOption = 1;
        create(text, option, subOption);
    }

    passOp = [6]
    if(passOp.includes(option) && subOption === 1 && !text.includes('문의사항을 입력해주세요.') && !text.includes('문의 하시겠습니까?')){
        handleQuestion(text)
        text = `"${text}"를 문의 하시겠습니까?`
        option = 6;
        subOption = 2;
        quick = 6;
        create(text, option, subOption, quick)
    }

    if(passOp.includes(option) && subOption === 2 && text === '네'){
        handleLoading(true)
        axios.post(url + `/api/insertQna.dab`,
        {
            role: userInfo.role,
            user_id: userInfo.user_id,
            content: question,
        }).then((response) => {
            text = '문의사항이 전달 되었습니다.'
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
                        {
                            title: '문의사항',
                            value: '문의사항',
                        }
                    ],
                },
                option: 0,
                subOption: 0,
            }
            handleLoading(false)
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
                handleLoading(false)
                messageSend(message)
        })
    }
    if(option===6 && subOption === 2 && text === '아니요'){
        text = '처음으로 돌아갑니다.';
        create(text, 0, 0, 1)
    }
    // 음성인식
    passOp = [0, 7]
    let basicMenu = ['현물조회', '샘플신청', '아이템 정보','문의사항','아이템정보', '다시 선택','대체 아이템']
    if(text==undefined){
        text = '로그아웃 하여 중간에 text가 사라져 text.length에 에러가 생겨서 추가합니다.'
    }
    if(!basicMenu.includes(text) && passOp.includes(option) && text.length < 20 && !text.includes('YD') && !text.includes('처음') && !text.includes('현물없음')){
    // if(option===7){
        let inventorySearch = ['현물','수량','재고','현물조회']
        let sampleAplly = ['샘플','신청','샘플신청','주문']
        let itemInfo = ['스펙','단가','업','아이템','정보','스펙조회']
        let all = []
        let includesMenu = false

        inventorySearch.forEach((i)=>all.push(i))
        sampleAplly.forEach((i)=>all.push(i))
        itemInfo.forEach((i)=>all.push(i))

        let sentence = text.split(' ')
        
        let cName
        let itemName = '';
        let cYW
        let qty
        let price
        let menu
        let subMenu
        let itemArr = [];
        let itemListCount

        for (let i = 0; i < all.length; i++) {
            if(sentence.includes(all[i])){
                includesMenu = true
            }
            
        }

        if(sentence.length === 2 && !includesMenu){
            sentence = [text.replace(/ /g,"")]
        }
        // 아이템명만 입력한 경우
        if(sentence.length===1 && text !== '업차지'){
            if(text === "안녕하세요"){
                handleQuestion(text)
                text = `"${text}"를 문의 하시겠습니까?`
                option = 6;
                subOption = 2;
                quick = 6;
                create(text, option, subOption, quick);
            } else {
                itemName = sentence[0];
            // 고객
            if(userInfo.role === 'client'|| userInfo.role === 'partner'){
                // 스펙 조회
                if (userInfo.role === 'client') {
                    handleLoading(true)
                    axios.post(url + `/api/searchItem.dab`,
                        {
                            itemName: itemName
                        }).then((response) => {
                            let itemCode = response.data.itemCode;
                            axios.post(url + `/api/itemSpecInfo.dab`,
                                {
                                    itemCode: itemCode
                                }
                            ).then((response) => {
                                let spec = response.data;
                                let specItemName = spec.itemName;
                                let itemNo = spec.itemNo;
                                let price = spec.price.split('.')
                                let check = spec.dry_friction === null
                                text = `${specItemName}(${itemNo}) 스펙\n\n염색 : ${spec.dyeingGbn}\n혼용률 : ${spec.composition}\n사용폭 : ${spec.width}±2%,   중량 : ${spec.weight} g/yd\n조직도 : ${spec.organization},   후가공 : ${spec.finish}\n${userInfo.access_level === '3' ? `\n단가 : ${spec.priceC}원\n` : ''}\n${userInfo.specGB === 'Y' ? `경사사종/번수\n - ${spec.ksajong}\n위사사종/번수\n - ${spec.wsajong}\n경사밀도 : ${spec.kdensity}\n위사밀도 : ${spec.wdensity}\n\n` : ''}${check ? '' : `*견뢰도*\n건마찰 : ${spec.dry_friction},     습마찰 : ${spec.swrat_friction}\n세   탁 : ${spec.cleaning},     드라이 : ${spec.dry}\n땀 : ${spec.sweat}`}${userInfo.priceGB === 'Y' ? `\n\n매입단가\n${spec.custName} : ${price[0]}원` : ''}`

                                handleOption(0)
                                handleSubOption(0)
                                message = {
                                    createdAt: new Date(),
                                    _id: Math.round(Math.random() * 1000000),
                                    text: text,
                                    user: {
                                        _id: 2
                                    },
                                    // quickReplies: {
                                    //     type: 'radio',
                                    //     values: [
                                    //         {
                                    //             title: '현물조회',
                                    //             value: '현물조회',
                                    //         },
                                    //         {
                                    //             title: '샘플신청',
                                    //             value: '샘플신청',
                                    //         },
                                    //         {
                                    //             title: '아이템 정보',
                                    //             value: '아이템 정보',
                                    //         },
                                    //         {
                                    //             title: '문의사항',
                                    //             value: '문의사항',
                                    //         }
                                    //     ],
                                    // },
                                    option: 0,
                                    subOption: 0
                                }
                                // handleLoading(false)
                                messageSend(message)
                                Keyboard.dismiss()
                                //로그입력
                                axios.post(url + `/api/insertLog.dab`, {
                                    log_gb: '03',
                                    item_code: itemCode,
                                    item_name: response.data.itemName,
                                    user_name: userInfo.user_name,
                                    role: userInfo.role,
                                    cust_name: userInfo.company_name
                                })
                            }).catch((err) => {
                                if (err.message.includes('spec.prodList[0]')) {
                                    text = `${itemName}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`;
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
                                    // handleLoading(false)
                                    messageSend(message)
                                } else {
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
                                        // quickReplies: {
                                        //     type: 'radio',
                                        //     values: [
                                        //         {
                                        //             title: '현물조회',
                                        //             value: '현물조회',
                                        //         },
                                        //         {
                                        //             title: '샘플신청',
                                        //             value: '샘플신청',
                                        //         },
                                        //         {
                                        //             title: '아이템 정보',
                                        //             value: '아이템 정보',
                                        //         },
                                        //     ],
                                        // },
                                        option: 0,
                                        subOption: 0,
                                    }
                                    // handleLoading(false)
                                    messageSend(message)
                                }
                            })
                        }).catch((err) => {
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
                                // quickReplies: {
                                //     type: 'radio',
                                //     values: [
                                //         {
                                //             title: '현물조회',
                                //             value: '현물조회',
                                //         },
                                //         {
                                //             title: '샘플신청',
                                //             value: '샘플신청',
                                //         },
                                //         {
                                //             title: '아이템 정보',
                                //             value: '아이템 정보',
                                //         },
                                //     ],
                                // },
                                option: 0,
                                subOption: 0,
                            }
                            // handleLoading(false)
                            messageSend(message)
                        })
                }
                if (userInfo.role === 'partner') {
                    handleLoading(true)
                    axios.post(url + `/api/searchItem.dab`,
                        {
                            itemName: itemName
                        }).then((response) => {
                            let itemCode = response.data.itemCode;
                            axios.post(url + `/api/itemSpecInfo.dab`,
                                {
                                    itemCode: itemCode
                                }
                            ).then((response) => {
                                let spec = response.data;
                                let specItemName = spec.itemName;
                                let itemNo = spec.itemNo;
                                let price = spec.price.split('.')
                                let check = spec.dry_friction === null
                                text = `${specItemName}(${itemNo}) 스펙\n\n염색 : ${spec.dyeingGbn}\n혼용률 : ${spec.composition}\n사용폭 : ${spec.width}±2%,   중량 : ${spec.weight} g/yd\n조직도 : ${spec.organization},   후가공 : ${spec.finish}\n${userInfo.access_level === '3' ? `\n단가 : ${spec.priceC}원\n` : ''}\n${userInfo.specGB === 'Y' ? `경사사종/번수\n - ${spec.ksajong}\n위사사종/번수\n - ${spec.wsajong}\n경사밀도 : ${spec.kdensity}\n위사밀도 : ${spec.wdensity}\n\n` : ''}${check ? '' : `*견뢰도*\n건마찰 : ${spec.dry_friction},     습마찰 : ${spec.swrat_friction}\n세   탁 : ${spec.cleaning},     드라이 : ${spec.dry}\n땀 : ${spec.sweat}`}${userInfo.priceGB === 'Y' ? `\n\n매입단가\n${spec.custName} : ${price[0]}원` : ''}`

                                handleOption(0)
                                handleSubOption(0)
                                message = {
                                    createdAt: new Date(),
                                    _id: Math.round(Math.random() * 1000000),
                                    text: text,
                                    user: {
                                        _id: 2
                                    },
                                    // quickReplies: {
                                    //     type: 'radio',
                                    //     values: [
                                    //         {
                                    //             title: '현물조회',
                                    //             value: '현물조회',
                                    //         },
                                    //         {
                                    //             title: '샘플신청',
                                    //             value: '샘플신청',
                                    //         },
                                    //         {
                                    //             title: '아이템 정보',
                                    //             value: '아이템 정보',
                                    //         },
                                    //         {
                                    //             title: '문의사항',
                                    //             value: '문의사항',
                                    //         }
                                    //     ],
                                    // },
                                    option: 0,
                                    subOption: 0
                                }
                                // handleLoading(false)
                                messageSend(message)
                                Keyboard.dismiss()
                                //로그입력
                                axios.post(url + `/api/insertLog.dab`, {
                                    log_gb: '03',
                                    item_code: itemCode,
                                    item_name: response.data.itemName,
                                    user_name: userInfo.user_name,
                                    role: userInfo.role,
                                    cust_name: userInfo.company_name
                                })
                            }).catch((err) => {
                                if (err.message.includes('spec.prodList[0]')) {
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
                                    // handleLoading(false)
                                    messageSend(message)
                                } else {
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
                                        // quickReplies: {
                                        //     type: 'radio',
                                        //     values: [
                                        //         {
                                        //             title: '현물조회',
                                        //             value: '현물조회',
                                        //         },
                                        //         {
                                        //             title: '샘플신청',
                                        //             value: '샘플신청',
                                        //         },
                                        //         {
                                        //             title: '아이템 정보',
                                        //             value: '아이템 정보',
                                        //         },
                                        //     ],
                                        // },
                                        option: 0,
                                        subOption: 0,
                                    }
                                    // handleLoading(false)
                                    messageSend(message)
                                }
                            })
                        }).catch((err) => {
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
                                // quickReplies: {
                                //     type: 'radio',
                                //     values: [
                                //         {
                                //             title: '현물조회',
                                //             value: '현물조회',
                                //         },
                                //         {
                                //             title: '샘플신청',
                                //             value: '샘플신청',
                                //         },
                                //         {
                                //             title: '아이템 정보',
                                //             value: '아이템 정보',
                                //         },
                                //     ],
                                // },
                                option: 0,
                                subOption: 0,
                            }
                            // handleLoading(false)
                            messageSend(message)
                        })
                } // 스펙 조회 끝

                // 현물 조회
                // handleLoading(true)
                axios.post(url + '/api/currentInventory.dab',
                    {
                        itemName: itemName,
                        includeYN: 1
                    }).then((resoponse) => {
                        let r = resoponse.data;

                        if (r !== undefined) {
                            let lastIndex = r.length - 1;
                            text = `${r[0].itemname} (${r[0].itemnocode})\n칼라별 수량\n\n`
                            r.map((i, index) => {
                                let gayoung = i.gayoungqty !== '0.00' ? `, 지사 ${i.gayoungqty}YD` : ''
                                let product = i.productqty !== '0.00' ? `, 작업중 ${i.productqty}YD` : ''
                                let jae = parseFloat(i.jaeqty) //- parseFloat(i.holdqty)
                                if (i.jaeqty > 1) {
                                    index === lastIndex ?

                                        text += `${i.coloryw}\n현물 ${jae.toFixed(2)}YD${gayoung}${product}`
                                        :
                                        text += `${i.coloryw}\n현물 ${jae.toFixed(2)}YD${gayoung}${product}\n\n`
                                }
                                if (i.jaeqty < 1 && i.jaeqty >= 0) {
                                    if (i.gayoungqty !== '0.00' || i.productqty !== '0.00') {
                                        gayoung = i.gayoungqty !== '0.00' ? `지사 ${i.gayoungqty}YD` : ''
                                        product = i.productqty !== '0.00' ? i.gayoungqty !== '0.00' ? `, 작업중 ${i.productqty}YD` : `작업중 ${i.productqty}YD` : ''
                                        index === lastIndex ?
                                            text += `${i.coloryw}\n${gayoung}${product}`
                                            :
                                            text += `${i.coloryw}\n${gayoung}${product}\n\n`
                                    }
                                }
                                // index === lastIndex ?
                                //     text += `${i.coloryw}\n${i.jaeqty}YD`
                                //     :
                                //     text += `${i.coloryw}\n${i.jaeqty}YD\n\n`
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
                                        {
                                            title: '문의사항',
                                            value: '문의사항',
                                        }
                                    ],
                                },
                                option: 0,
                                subOption: 0,
                            }
                            handleOption(0)
                            handleSubOption(0)
                            handleLoading(false)
                            messageSend(message)
                            //로그입력
                            axios.post(url + `/api/insertLog.dab`, {
                                log_gb: '01',
                                item_code: r[0].itemcode,
                                item_name: r[0].itemname,
                                color_name: '전칼라',
                                user_name: userInfo.user_name,
                                role: userInfo.role,
                                cust_name: userInfo.company_name,
                            })
                        }
                    }).catch((err) => {
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
                                    {
                                        title: '문의사항',
                                        value: '문의사항',
                                    }
                                ],
                            },
                            option: 0,
                            subOption: 0,
                        }
                        handleLoading(false)
                        messageSend(message)
                    })
                Keyboard.dismiss()
                // 현물 조회 끝
            }
            // 직원
            if (userInfo.role === 'employee') {
                // 스펙 조회
                handleLoading(true)
                axios.post(url + `/api/searchItem.dab`,
                    {
                        itemName: itemName
                    }).then((response) => {
                        let itemCode = response.data.itemCode;
                        axios.post(url + `/api/itemSpecInfo.dab`,
                            {
                                itemCode: itemCode
                            }
                        ).then((response) => {
                            let spec = response.data;
                            let specItemName = spec.itemName;
                            let itemNo = spec.itemNo;
                            let price = spec.price.split('.')
                            let check = spec.dry_friction === null
                            text = `${specItemName}(${itemNo}) 스펙\n\n염색 : ${spec.dyeingGbn}\n혼용률 : ${spec.composition}\n사용폭 : ${spec.width}±2%,   중량 : ${spec.weight} g/yd\n조직도 : ${spec.organization},   후가공 : ${spec.finish}\n${userInfo.access_level === '3' ? `\n단가 : ${spec.priceC}원\n` : ''}\n${userInfo.specGB === 'Y' ? `경사사종/번수\n - ${spec.ksajong}\n위사사종/번수\n - ${spec.wsajong}\n경사밀도 : ${spec.kdensity}\n위사밀도 : ${spec.wdensity}\n\n` : ''}${check ? '' : `*견뢰도*\n건마찰 : ${spec.dry_friction},     습마찰 : ${spec.swrat_friction}\n세   탁 : ${spec.cleaning},     드라이 : ${spec.dry}\n땀 : ${spec.sweat}`}${userInfo.priceGB === 'Y' ? `\n\n매입단가\n${spec.custName} : ${price[0]}원` : ''}`

                            handleOption(3)
                            handleSubOption(2)
                            message = {
                                createdAt: new Date(),
                                _id: Math.round(Math.random() * 1000000),
                                text: text,
                                user: {
                                    _id: 2
                                },
                                // quickReplies: {
                                //     type: 'radio',
                                //     values: [
                                //         {
                                //             title: '업차지',
                                //             value: '업차지',
                                //         },
                                //         {
                                //             title: '스펙과 단가',
                                //             value: '스펙과 단가',
                                //         },
                                //         {
                                //             title: '다른 아이템 조회',
                                //             value: '다른 아이템 조회'
                                //         },
                                //         {
                                //             title: '처음 단계로',
                                //             value: '처음 단계로',
                                //         },
                                //     ],
                                // },
                                option: 3,
                                subOption: 2
                            }
                            // handleLoading(false)
                            messageSend(message)
                            Keyboard.dismiss()

                            //로그입력
                            axios.post(url + `/api/insertLog.dab`, {
                                log_gb: '03',
                                item_code: itemCode,
                                item_name: itemName,
                                user_name: userInfo.user_name,
                                role: userInfo.role,
                                cust_name: userInfo.company_name
                            })
                        }).catch((err) => {
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
                                // quickReplies: {
                                //     type: 'radio',
                                //     values: [
                                //         {
                                //             title: '현물조회',
                                //             value: '현물조회',
                                //         },
                                //         {
                                //             title: '샘플신청',
                                //             value: '샘플신청',
                                //         },
                                //         {
                                //             title: '아이템 정보',
                                //             value: '아이템 정보',
                                //         },
                                //     ],
                                // },
                                option: 0,
                                subOption: 0,
                            }
                            // handleLoading(false)
                            messageSend(message)
                        })
                    }).catch((err) => {
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
                            // quickReplies: {
                            //     type: 'radio',
                            //     values: [
                            //         {
                            //             title: '현물조회',
                            //             value: '현물조회',
                            //         },
                            //         {
                            //             title: '샘플신청',
                            //             value: '샘플신청',
                            //         },
                            //         {
                            //             title: '아이템 정보',
                            //             value: '아이템 정보',
                            //         },
                            //     ],
                            // },
                            option: 0,
                            subOption: 0,
                        }
                        // handleLoading(false)
                        messageSend(message)
                    }) // 스펙 조회 끝
                // 현물 조회
                // handleLoading(true)
                axios.post(url + '/api/currentInventory.dab',
                    {
                        itemName: itemName,
                        includeYN: 0
                    }).then((response) => {

                        if (response.data.length === 0) {
                            text = `${itemName}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`
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
                            handleLoading(false)
                            messageSend(message)
                        } else {
                            axios.post(url + '/api/currentInventory.dab',
                                {
                                    itemName: itemName,
                                    includeYN: 1
                                }).then((resoponse) => {
                                    let r = resoponse.data;

                                    if (r !== undefined) {
                                        let lastIndex = r.length - 1;
                                        text = `${r[0].itemname} (${r[0].itemnocode})\n칼라별 수량\n\n`
                                        r.map((i, index) => {
                                            let gayoung = i.gayoungqty !== '0.00' ? `, 지사 ${i.gayoungqty}YD` : ''
                                            let product = i.productqty !== '0.00' ? `, 작업중 ${i.productqty}YD` : ''
                                            let jae = parseFloat(i.jaeqty) //- parseFloat(i.holdqty)
                                            if (i.jaeqty > 1) {
                                                index === lastIndex ?

                                                    text += `${i.coloryw}\n현물 ${jae.toFixed(2)}YD${gayoung}${product}`
                                                    :
                                                    text += `${i.coloryw}\n현물 ${jae.toFixed(2)}YD${gayoung}${product}\n\n`
                                            }
                                            if (i.jaeqty < 1 && i.jaeqty >= 0) {
                                                if (i.gayoungqty !== '0.00' || i.productqty !== '0.00') {
                                                    gayoung = i.gayoungqty !== '0.00' ? `지사 ${i.gayoungqty}YD` : ''
                                                    product = i.productqty !== '0.00' ? i.gayoungqty !== '0.00' ? `, 작업중 ${i.productqty}YD` : `작업중 ${i.productqty}YD` : ''
                                                    index === lastIndex ?
                                                        text += `${i.coloryw}\n${gayoung}${product}`
                                                        :
                                                        text += `${i.coloryw}\n${gayoung}${product}\n\n`
                                                }
                                            }
                                            // index === lastIndex ?
                                            //     text += `${i.coloryw}\n${i.jaeqty}YD`
                                            //     :
                                            //     text += `${i.coloryw}\n${i.jaeqty}YD\n\n`
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
                                        handleOption(0)
                                        handleSubOption(0)
                                        handleLoading(false)
                                        messageSend(message)
                                        //로그입력
                                        axios.post(url + `/api/insertLog.dab`, {
                                            log_gb: '01',
                                            item_code: r[0].itemcode,
                                            item_name: r[0].itemname,
                                            color_name: '전칼라',
                                            user_name: userInfo.user_name,
                                            role: userInfo.role,
                                            cust_name: userInfo.company_name,
                                        })
                                    }
                                }).catch((err) => {
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
                                    handleLoading(false)
                                    messageSend(message)
                                })
                            Keyboard.dismiss()
                        }
                    }).catch((err) => {
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
                        handleLoading(false)
                        messageSend(message)
                    }) // 현물 조회 끝
            }
            }
        }
        // 나머지
        else{
            // menu 및 기본 정보 확인
            if(includesMenu){
                if(!numCheck(sentence[1])&&!all.includes(sentence[1])){
                    itemName = sentence[0]+sentence[1]
                    let tmp = [itemName]
                    for(var i = 2; i < sentence.length; i++){
                        tmp.push(sentence[i])
                    }
                    sentence = tmp
                }
            }
            for (var i in sentence) {
                for (var j in itemInfo) {
                    // 현물 조회
                    if (sentence[i].includes(inventorySearch[j])) {
                        itemName = sentence[0]
                        menu = '현물 조회'
                        // 아이템 명만 입력된 경우
                        if (isNaN(Number(sentence[i - 1].replace(',', '')))) {
                            cYW = -1
                        }
                        // 컬러도 입력된 경우
                        if (!isNaN(Number(sentence[i - 1].replace(',', '')))) {
                            cYW = sentence[i - 1].replace(',', '')
                        }
                    }
                    // 샘플 신청
                    if (sentence[i].includes(sampleAplly[j])) {
                        menu = '샘플 신청'

                        // 정수, 소수를 제외한 문자열 제거 정규식
                        // let qty=str.replace(/[^\d.-]/g,'');

                        if (userInfo.role === 'client' || userInfo.role === 'partner') {
                            itemListCount = parseInt(i / 3)
                            // 아이템 명 뒤에 컬러번호가 입력되지 않은 경우
                            // 한가지 아이템만 주문한 경우
                            if (itemListCount < 2) {
                                let item = ''
                                item += sentence[0]

                                if (isNaN(Number(sentence[1].replace(',', '')))) {
                                    // 샘플 신청으로 보내기
                                    subMenu = '샘플 신청'
                                }
                                // 아이템 명 뒤에 컬러번호가 입력된 경우
                                if (!isNaN(Number(sentence[1].replace(',', '')))) {
                                    item += ' ' + sentence[1].replace(',', '')
                                    // 수량을 입력하지 않은 경우
                                    if (!numCheck(sentence[2].replace(/[^\d.-]/g, ''))) {
                                        subMenu = '샘플 신청'
                                    }
                                    // 수량을 입력한 경우
                                    if (numCheck(sentence[2].replace(/[^\d.-]/g, ''))) {
                                        item += ' ' + sentence[2].replace(/[^\d.-]/g, '')
                                        subMenu = '배송 방법'
                                    }
                                }
                                else {
                                    subMenu = '샘플 신청'
                                }
                                if (!itemArr.includes(item)) {
                                    itemArr.push(item)
                                }
                            }
                            // 여러 아이템 주문한 경우
                            if (itemListCount >= 2) {
                                if (isNaN(Number(sentence[1].replace(',', '')))) {
                                    // 샘플 신청으로 보내기
                                    subMenu = '샘플 신청'
                                }
                                if (!isNaN(Number(sentence[1].replace(',', '')))) {
                                    // 수량을 입력하지 않은 경우
                                    if (!numCheck(sentence[2].replace(/[^\d.-]/g, ''))) {
                                        subMenu = '샘플 신청'
                                    }
                                    // 수량을 입력한 경우
                                    if (numCheck(sentence[2].replace(/[^\d.-]/g, ''))) {
                                        subMenu = '배송 방법'
                                    }
                                }
                                for (let k = 0; k < itemListCount; k++) {
                                    let item = ''
                                    item += sentence[k * 3 + 0]
                                    item += ' ' + sentence[k * 3 + 1].replace(',', '')
                                    item += ' ' + sentence[k * 3 + 2].replace(/[^\d.-]/g, '')
                                    if (!itemArr.includes(item)) {
                                        itemArr.push(item)
                                    }
                                }
                            }

                        }
                        if (userInfo.role === 'employee') {
                            cName = sentence[0]
                            subMenu = "수량 입력"
                        }
                    }
                    // 아이템 정보
                    if (sentence[i].includes(itemInfo[j])&&text!=='스펙과 단가'&&text!=='업차지') {
                        itemName = sentence[0]
                        menu = '아이템 정보'
                        let specInfo = ['스펙', '단가', '아이템','정보']
                        if (specInfo.includes(itemInfo[j])) {
                            subMenu = '스펙과 단가'
                        }
                        if (itemInfo[j] === '업' && userInfo.role === 'employee') {
                            subMenu = '업차지'
                        }
                    }
                }
            }
            // 메뉴별 서버요청
            // 현물조회
            if (menu === '현물 조회') {
                // 아이템 명만 입력된 경우
                if (cYW === -1) {
                    // 직원
                    if (userInfo.role === 'employee') {
                        handleLoading(true)
                        axios.post(url + '/api/currentInventory.dab',
                            {
                                itemName: itemName,
                                includeYN: 0
                            }).then((response) => {
                                if (response.data.length === 0) {
                                    text = `${itemName}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`
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
                                    handleLoading(false)
                                    messageSend(message)
                                } else {
                                    axios.post(url + '/api/currentInventory.dab',
                                        {
                                            itemName: itemName,
                                            includeYN: 1
                                        }).then((resoponse) => {
                                            let r = resoponse.data;
                                            if (r !== undefined) {
                                                let lastIndex = r.length - 1;
                                                text = `${r[0].itemname} (${r[0].itemnocode})\n칼라별 수량\n\n`
                                                r.map((i, index) => {
                                                    let gayoung = i.gayoungqty !== '0.00' ? `, 지사 ${i.gayoungqty}YD` : ''
                                                    let product = i.productqty !== '0.00' ? `, 작업중 ${i.productqty}YD` : ''
                                                    let jae = parseFloat(i.jaeqty) //- parseFloat(i.holdqty)
                                                    if (i.jaeqty > 1) {
                                                        index === lastIndex ?

                                                            text += `${i.coloryw}\n현물 ${jae.toFixed(2)}YD${gayoung}${product}`
                                                            :
                                                            text += `${i.coloryw}\n현물 ${jae.toFixed(2)}YD${gayoung}${product}\n\n`
                                                    }
                                                    if (i.jaeqty < 1 && i.jaeqty >= 0) {
                                                        if (i.gayoungqty !== '0.00' || i.productqty !== '0.00') {
                                                            gayoung = i.gayoungqty !== '0.00' ? `지사 ${i.gayoungqty}YD` : ''
                                                            product = i.productqty !== '0.00' ? i.gayoungqty !== '0.00' ? `, 작업중 ${i.productqty}YD` : `작업중 ${i.productqty}YD` : ''
                                                            index === lastIndex ?
                                                                text += `${i.coloryw}\n${gayoung}${product}`
                                                                :
                                                                text += `${i.coloryw}\n${gayoung}${product}\n\n`
                                                        }
                                                    }
                                                    // index === lastIndex ?
                                                    //     text += `${i.coloryw}\n${i.jaeqty}YD`
                                                    //     :
                                                    //     text += `${i.coloryw}\n${i.jaeqty}YD\n\n`
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
                                                handleOption(0)
                                                handleSubOption(0)
                                                handleLoading(false)
                                                messageSend(message)
                                                //로그입력
                                                axios.post(url + `/api/insertLog.dab`, {
                                                    log_gb: '01',
                                                    item_code: r[0].itemcode,
                                                    item_name: r[0].itemname,
                                                    color_name: '전칼라',
                                                    user_name: userInfo.user_name,
                                                    role: userInfo.role,
                                                    cust_name: userInfo.company_name,
                                                })
                                            }
                                        }).catch((err) => {
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
                                            handleLoading(false)
                                            messageSend(message)
                                        })
                                    Keyboard.dismiss()
                                    // // 용도 선택
                                    // text = `용도를 선택해 주세요.`;
                                    // handleOption(1)
                                    // handleSubOption(2)
                                    // handleItem(itemName)
                                    // message = {
                                    //     createdAt: new Date(),
                                    //     _id: Math.round(Math.random() * 1000000),
                                    //     text: text,
                                    //     user: {
                                    //         _id: 2
                                    //     },
                                    //     quickReplies: {
                                    //         type: 'radio',
                                    //         values: [
                                    //             {
                                    //                 title: '업체용',
                                    //                 value: '업체용',
                                    //             },
                                    //             {
                                    //                 title: '직원용',
                                    //                 value: '직원용'
                                    //             }
                                    //         ]
                                    //     },
                                    //     option: 1,
                                    //     subOption: 2,
                                    // }
                                    // messageSend(message)
                                    // Keyboard.dismiss()
                                }
                            }).catch((err) => {
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
                                handleLoading(false)
                                messageSend(message)
                            })
                    }
                    // 고객 or 파트너
                    if (userInfo.role === 'client' || userInfo.role === 'partner') {
                        handleLoading(true)
                        axios.post(url + '/api/currentInventory.dab',
                            {
                                itemName: itemName,
                                includeYN: 1
                            }).then((resoponse) => {
                                let r = resoponse.data;

                                if (r !== undefined) {
                                    let lastIndex = r.length - 1;
                                    text = `${r[0].itemname} (${r[0].itemnocode})\n칼라별 수량\n\n`
                                    r.map((i, index) => {
                                        let gayoung = i.gayoungqty !== '0.00' ? `, 지사 ${i.gayoungqty}YD` : ''
                                        let product = i.productqty !== '0.00' ? `, 작업중 ${i.productqty}YD` : ''
                                        let jae = parseFloat(i.jaeqty) //- parseFloat(i.holdqty)
                                        if (i.jaeqty > 1) {
                                            index === lastIndex ?

                                                text += `${i.coloryw}\n현물 ${jae.toFixed(2)}YD${gayoung}${product}`
                                                :
                                                text += `${i.coloryw}\n현물 ${jae.toFixed(2)}YD${gayoung}${product}\n\n`
                                        }
                                        if (i.jaeqty < 1 && i.jaeqty >= 0) {
                                            if (i.gayoungqty !== '0.00' || i.productqty !== '0.00') {
                                                gayoung = i.gayoungqty !== '0.00' ? `지사 ${i.gayoungqty}YD` : ''
                                                product = i.productqty !== '0.00' ? i.gayoungqty !== '0.00' ? `, 작업중 ${i.productqty}YD` : `작업중 ${i.productqty}YD` : ''
                                                index === lastIndex ?
                                                    text += `${i.coloryw}\n${gayoung}${product}`
                                                    :
                                                    text += `${i.coloryw}\n${gayoung}${product}\n\n`
                                            }
                                        }
                                        // index === lastIndex ?
                                        //     text += `${i.coloryw}\n${i.jaeqty}YD`
                                        //     :
                                        //     text += `${i.coloryw}\n${i.jaeqty}YD\n\n`
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
                                                {
                                                    title: '문의사항',
                                                    value: '문의사항',
                                                }
                                            ],
                                        },
                                        option: 0,
                                        subOption: 0,
                                    }
                                    handleOption(0)
                                    handleSubOption(0)
                                    handleLoading(false)
                                    messageSend(message)
                                    //로그입력
                                    axios.post(url + `/api/insertLog.dab`, {
                                        log_gb: '01',
                                        item_code: r[0].itemcode,
                                        item_name: r[0].itemname,
                                        color_name: '전칼라',
                                        user_name: userInfo.user_name,
                                        role: userInfo.role,
                                        cust_name: userInfo.company_name,
                                    })
                                }
                            }).catch((err) => {
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
                                            {
                                                title: '문의사항',
                                                value: '문의사항',
                                            }
                                        ],
                                    },
                                    option: 0,
                                    subOption: 0,
                                }
                                handleLoading(false)
                                messageSend(message)
                            })
                        Keyboard.dismiss()
                    }
                }

                // 컬러도 입력된 경우
                else {
                    // 직원
                    if (userInfo.role === 'employee') {
                        handleLoading(true)
                        axios.post(url + '/api/currentInventory.dab',
                            {
                                itemName: itemName,
                                colorYW: cYW,
                                includeYN: 1
                            }).then((resoponse) => {
                                let r = resoponse.data[0];
                                if (r !== undefined) {
                                    axios.post(url + `/api/currentLotInventory.dab`,
                                        {
                                            itemName: itemName,
                                            colorYW: cYW
                                        }).then((res) => {
                                            let ipjulCnt = res.data.ipjulCnt;
                                            let maxQty = res.data.maxQty;
                                            if (r !== undefined) {
                                                axios.post(url + `/api/productionQuantity.dab`, {
                                                    itemCode: res.data.itemCode,
                                                    colorNo: res.data.colorNo
                                                }).then((res) => {
                                                    handleOption(0)
                                                    handleSubOption(0)
                                                    if (res.data.length === 0) {
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
                                                    if (res.data.length > 0) {
                                                        let pqty = '';
                                                        for (let i = 0; i < res.data.length; i++) {
                                                            pqty += `${res.data[i].qty}${res.data[i].unit} (${res.data[i].delyDate})`;
                                                            if (i !== res.data.length - 1) {
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
                                                    handleLoading(false)
                                                    messageSend(message)
                                                    //로그입력
                                                    axios.post(url + `/api/insertLog.dab`, {
                                                        log_gb: '01',
                                                        item_code: r.itemcode,
                                                        item_name: r.itemname,
                                                        color_name: r.coloryw,
                                                        hq_cnt: r.jaeqty,
                                                        deagu_cnt: r.gayoungqty,
                                                        prod_cnt: r.productqty,
                                                        hold_cnt: r.holdqty,
                                                        user_name: userInfo.user_name,
                                                        role: userInfo.role,
                                                        cust_name: userInfo.company_name,
                                                    })
                                                }).catch((err) => {
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
                                                    handleLoading(false)
                                                    messageSend(message)
                                                })
                                            }
                                        }).catch((err) => {
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
                                            handleLoading(false)
                                            messageSend(message)
                                        })
                                } else {
                                    text = `${itemName}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`
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
                                    handleLoading(false)
                                    messageSend(message)
                                }
                            }).catch((err) => {
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
                                handleLoading(false)
                                messageSend(message)
                            })
                        Keyboard.dismiss()
                    }

                    // 고객 or 파트너
                    if (userInfo.role === 'client' || userInfo.role === 'partner') {
                        let color = cYW
                        handleLoading(true)
                        axios.post(url + '/api/currentInventory.dab',
                            {
                                itemName: itemName,
                                // colorYW: color,
                                includeYN: 1
                            }).then((response) => {
                                let res = response.data
                                let r = res.filter(item => item.coloryw === color);
                                if (res !== undefined) {
                                    if (r.length !== 0) {
                                        if (parseInt(r[0].jaeqty) < 1) {
                                            let similarColor = color.substring(0, 3)
                                            let recommend = res.filter(item => item.coloryw.includes(similarColor))
                                            let colorList = [];
                                            recommend.forEach(item => {
                                                if (item.jaeqty > 0) {
                                                    colorList.push({ coloryw: item.coloryw, jaeqty: item.jaeqty })
                                                }
                                            })
                                            if (colorList.length === 0) {
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
                                                handleOption(0)
                                                handleSubOption(0)
                                                handleLoading(false)
                                                messageSend(message)
                                            }
                                            if (colorList.length > 0) {
                                                let rcText = '';
                                                colorList.forEach(item => rcText += `${item.coloryw} (${item.jaeqty})YD\n`)
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
                                                handleOption(0)
                                                handleSubOption(0)
                                                handleLoading(false)
                                                messageSend(message)
                                            }
                                        } else {
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
                                            handleOption(0)
                                            handleSubOption(0)
                                            handleItem(itemName)
                                            handleItemName(itemName)
                                            handleColor(color)
                                            handleLoading(false)
                                            messageSend(message)
                                        }
                                        //로그입력
                                        axios.post(url + `/api/insertLog.dab`, {
                                            log_gb: '01',
                                            item_code: r[0].itemcode,
                                            item_name: r[0].itemname,
                                            color_name: r[0].coloryw,
                                            hq_cnt: r[0].jaeqty,
                                            deagu_cnt: r[0].gayoungqty,
                                            prod_cnt: r[0].productqty,
                                            hold_cnt: r[0].holdqty,
                                            user_name: userInfo.user_name,
                                            role: userInfo.role,
                                            cust_name: userInfo.company_name,
                                        })
                                    }
                                }
                            }).catch((err) => {
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
                                            {
                                                title: '문의사항',
                                                value: '문의사항',
                                            }
                                        ],
                                    },
                                    option: 0,
                                    subOption: 0,
                                }
                                handleLoading(false)
                                messageSend(message)
                            })
                        Keyboard.dismiss()
                    }
                }
            } // 현물조회 끝

            // 샘플신청
            if (menu === '샘플 신청') {
                // 분류 하지 못한 경우
                if (subMenu === '샘플 신청') {
                    text = `원하시는 아이템명, 컬러명, 수량을\n입력해주세요.\n\n예시) ${userInfo.promotion_Item} ${userInfo.promotion_Color} 10`;
                    option = 2;
                    subOption = 3;
                    create(text, option, subOption)
                }
                // 직원 수량 입력
                if (subMenu === '수량 입력') {
                    handleLoading(true)
                    axios.post(url + '/api/searchCustmors.dab',
                        { custName: cName }
                    )
                        .then((response) => {
                            let companyList = [];
                            response.data.forEach(i => companyList.push(i));
                            if (companyList.length === 1) {
                                let c = cName;
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
                                handleLoading(false)
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
                                handleOption(2)
                                handleSubOption(1)
                                handleLoading(false)
                                messageSend(message)
                                handleCompany(companyList)
                                selectCompany(companyList)
                                Keyboard.dismiss()
                            }
                            if (companyList.length === 0) {
                                handleOption(2);
                                handleSubOption(1);
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
                                handleLoading(false)
                                messageSend(message)
                            }
                        }).catch((err) => {
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
                            handleLoading(false)
                            messageSend(message)
                        })
                }
                // 전부다 입력된 경우
                if (subMenu === '배송 방법') {
                    let textArr = true;

                    itemArr.forEach((text) => {
                        let strArr = text.split(' ')
                        if (userInfo.role === "employee" && strArr.length < 3 && strArr.length > 4) {
                            text = `잘못 입력 하셨습니다. 다시 입력해 주세요.`
                            create(text, 2, 2)
                            textArr = false;
                        }
                        if (userInfo.role === "client" && strArr.length > 3) {
                            text = `잘못 입력 하셨습니다. 다시 입력해 주세요.`
                            create(text, 2, 2)
                            textArr = false;
                        }
                        if (userInfo.role === 'partner' && strArr.length > 3) {
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
                        itemArr.forEach((text) => {
                            let strArr = text.split(' ')
                            let item = {
                                item_name: ``,
                                item_code: ``,
                                color_code: ``,
                                colorYW: ``,
                                amount: ``,
                                price: ``
                            }
                            handleLoading(true)
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
                                                    if (price !== undefined) {
                                                        item.price = toCommaStringF(price)
                                                    }
                                                    if (price === undefined) {
                                                        axios.post(url + `/api/itemSpecInfo.dab`,
                                                            {
                                                                itemCode: item.item_code
                                                            }).then((response) => {
                                                                item.price = response.data.priceC
                                                            }).catch((err) => {
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
                                                                handleLoading(false)
                                                                messageSend(message)
                                                            })
                                                    }
                                                    itemList.push(item)

                                                    // 원래 1(x) text arr... 여러 주문건수 처리 불가
                                                    if (itemListCount === itemList.length) {
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
                                                        handleLoading(false)
                                                        messageSend(message)

                                                        // 고객일시 영업사원 전달 바로 보내기
                                                        if(userInfo.role==='client'||userInfo.role==='partner'){
                                                            message = {
                                                                createdAt: new Date(),
                                                                _id: Math.round(Math.random() * 1000000),
                                                                text: `영업사원전달`,
                                                                user: {
                                                                    _id: 1
                                                                },
                                                                option: 2,
                                                                subOption: 4,
                                                                item: itemList
                                                            }
                                                            messageSend(message)
                                                        }
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
                                                    handleLoading(false)
                                                    messageSend(message)
                                                }
                                            }).catch((err) => {
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
                                                handleLoading(false)
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
                                        handleLoading(false)
                                        messageSend(message)
                                    }
                                }).catch((err) => {
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
                                    handleLoading(false)
                                    messageSend(message)
                                })
                        })
                    }
                } // 배송 방법 끝
            } // 샘플신청 끝
            // 아이템 정보
            if (menu === '아이템 정보') {
                // 스펙과 단가
                if (subMenu === '스펙과 단가') {
                    if (userInfo.role === 'client') {
                        handleLoading(true)
                        axios.post(url + `/api/searchItem.dab`,
                            {
                                itemName: itemName
                            }).then((response) => {
                                let itemCode = response.data.itemCode;
                                axios.post(url + `/api/itemSpecInfo.dab`,
                                    {
                                        itemCode: itemCode
                                    }
                                ).then((response) => {
                                    let spec = response.data;
                                    let specItemName = spec.itemName;
                                    let itemNo = spec.itemNo;
                                    let price = spec.price.split('.')
                                    let check = spec.dry_friction === null
                                    text = `${specItemName}(${itemNo}) 스펙\n\n염색 : ${spec.dyeingGbn}\n혼용률 : ${spec.composition}\n사용폭 : ${spec.width}±2%,   중량 : ${spec.weight} g/yd\n조직도 : ${spec.organization},   후가공 : ${spec.finish}\n${userInfo.access_level === '3' ? `\n단가 : ${spec.priceC}원\n` : ''}\n${userInfo.specGB === 'Y' ? `경사사종/번수\n - ${spec.ksajong}\n위사사종/번수\n - ${spec.wsajong}\n경사밀도 : ${spec.kdensity}\n위사밀도 : ${spec.wdensity}\n\n` : ''}${check ? '' : `*견뢰도*\n건마찰 : ${spec.dry_friction},     습마찰 : ${spec.swrat_friction}\n세   탁 : ${spec.cleaning},     드라이 : ${spec.dry}\n땀 : ${spec.sweat}`}${userInfo.priceGB === 'Y' ? `\n\n매입단가\n${spec.custName} : ${price[0]}원` : ''}`

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
                                                {
                                                    title: '문의사항',
                                                    value: '문의사항',
                                                }
                                            ],
                                        },
                                        option: 0,
                                        subOption: 0
                                    }
                                    handleLoading(false)
                                    messageSend(message)
                                    Keyboard.dismiss()
                                    //로그입력
                                    axios.post(url + `/api/insertLog.dab`, {
                                        log_gb: '03',
                                        item_code: itemCode,
                                        item_name: response.data.itemName,
                                        user_name: userInfo.user_name,
                                        role: userInfo.role,
                                        cust_name: userInfo.company_name
                                    })
                                }).catch((err) => {
                                    if (err.message.includes('spec.prodList[0]')) {
                                        text = `${itemName}의 명칭을 가진 아이템이 없습니다.\n다시 입력해 주세요.`;
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
                                        handleLoading(false)
                                        messageSend(message)
                                    } else {
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
                                        handleLoading(false)
                                        messageSend(message)
                                    }
                                })
                            }).catch((err) => {
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
                                handleLoading(false)
                                messageSend(message)
                            })
                    }
                    if (userInfo.role === 'partner') {
                        handleLoading(true)
                        axios.post(url + `/api/searchItem.dab`,
                            {
                                itemName: itemName
                            }).then((response) => {
                                let itemCode = response.data.itemCode;
                                axios.post(url + `/api/itemSpecInfo.dab`,
                                    {
                                        itemCode: itemCode
                                    }
                                ).then((response) => {
                                    let spec = response.data;
                                    let specItemName = spec.itemName;
                                    let itemNo = spec.itemNo;
                                    let price = spec.price.split('.')
                                    let check = spec.dry_friction === null
                                    text = `${specItemName}(${itemNo}) 스펙\n\n염색 : ${spec.dyeingGbn}\n혼용률 : ${spec.composition}\n사용폭 : ${spec.width}±2%,   중량 : ${spec.weight} g/yd\n조직도 : ${spec.organization},   후가공 : ${spec.finish}\n${userInfo.access_level === '3' ? `\n단가 : ${spec.priceC}원\n` : ''}\n${userInfo.specGB === 'Y' ? `경사사종/번수\n - ${spec.ksajong}\n위사사종/번수\n - ${spec.wsajong}\n경사밀도 : ${spec.kdensity}\n위사밀도 : ${spec.wdensity}\n\n` : ''}${check ? '' : `*견뢰도*\n건마찰 : ${spec.dry_friction},     습마찰 : ${spec.swrat_friction}\n세   탁 : ${spec.cleaning},     드라이 : ${spec.dry}\n땀 : ${spec.sweat}`}${userInfo.priceGB === 'Y' ? `\n\n매입단가\n${spec.custName} : ${price[0]}원` : ''}`

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
                                                {
                                                    title: '문의사항',
                                                    value: '문의사항',
                                                }
                                            ],
                                        },
                                        option: 0,
                                        subOption: 0
                                    }
                                    handleLoading(false)
                                    messageSend(message)
                                    Keyboard.dismiss()
                                    //로그입력
                                    axios.post(url + `/api/insertLog.dab`, {
                                        log_gb: '03',
                                        item_code: itemCode,
                                        item_name: response.data.itemName,
                                        user_name: userInfo.user_name,
                                        role: userInfo.role,
                                        cust_name: userInfo.company_name
                                    })
                                }).catch((err) => {
                                    if (err.message.includes('spec.prodList[0]')) {
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
                                        handleLoading(false)
                                        messageSend(message)
                                    } else {
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
                                        handleLoading(false)
                                        messageSend(message)
                                    }
                                })
                            }).catch((err) => {
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
                                handleLoading(false)
                                messageSend(message)
                            })
                    }
                    if (userInfo.role === 'employee') {
                        handleLoading(true)
                        axios.post(url + `/api/searchItem.dab`,
                            {
                                itemName: itemName
                            }).then((response) => {
                                let itemCode = response.data.itemCode;
                                axios.post(url + `/api/itemSpecInfo.dab`,
                                    {
                                        itemCode: itemCode
                                    }
                                ).then((response) => {
                                    let spec = response.data;
                                    let specItemName = spec.itemName;
                                    let itemNo = spec.itemNo;
                                    let price = spec.price.split('.')
                                    let check = spec.dry_friction === null
                                    text = `${specItemName}(${itemNo}) 스펙\n\n염색 : ${spec.dyeingGbn}\n혼용률 : ${spec.composition}\n사용폭 : ${spec.width}±2%,   중량 : ${spec.weight} g/yd\n조직도 : ${spec.organization},   후가공 : ${spec.finish}\n${userInfo.access_level === '3' ? `\n단가 : ${spec.priceC}원\n` : ''}\n${userInfo.specGB === 'Y' ? `경사사종/번수\n - ${spec.ksajong}\n위사사종/번수\n - ${spec.wsajong}\n경사밀도 : ${spec.kdensity}\n위사밀도 : ${spec.wdensity}\n\n` : ''}${check ? '' : `*견뢰도*\n건마찰 : ${spec.dry_friction},     습마찰 : ${spec.swrat_friction}\n세   탁 : ${spec.cleaning},     드라이 : ${spec.dry}\n땀 : ${spec.sweat}`}${userInfo.priceGB === 'Y' ? `\n\n매입단가\n${spec.custName} : ${price[0]}원` : ''}`

                                    handleOption(0)
                                    handleSubOption(2)
                                    handleCompany('스펙정보')
                                    handleItem(itemName)
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
                                        option: 0,
                                        subOption: 2
                                    }
                                    handleLoading(false)
                                    messageSend(message)
                                    Keyboard.dismiss()

                                    //로그입력
                                    axios.post(url + `/api/insertLog.dab`, {
                                        log_gb: '03',
                                        item_code: itemCode,
                                        item_name: itemName,
                                        user_name: userInfo.user_name,
                                        role: userInfo.role,
                                        cust_name: userInfo.company_name
                                    })
                                }).catch((err) => {
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
                                    handleLoading(false)
                                    messageSend(message)
                                })
                            }).catch((err) => {
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
                                handleLoading(false)
                                messageSend(message)
                            })
                    }
                } // 스펙과 단가 끝

                // 업차지
                if (subMenu === '업차지') {
                    handleLoading(true)
                    axios.post(url + `/api/searchItem.dab`,
                        {
                            itemName: itemName
                        }).then((response) => {
                            let itemCode = response.data.itemCode;
                            axios.post(url + `/api/itemSpecInfo.dab`,
                                {
                                    itemCode: itemCode
                                }
                            ).then((response) => {
                                let spec = response.data;


                                let text;
                                let custName = spec.custName

                                switch (custName) {
                                    case '지사(대구)':
                                        if (spec.dyeingGbn === '선염') {
                                            text = `1000이하 45만원\n예) 500 - 900원\n900 - 500원`
                                        } else {
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
                                        text = `500이하 20만`;
                                        break;
                                    default:
                                        text = '업차지 정보가 입력되어있지 않습니다.'
                                        break;
                                }
                                handleOption(0)
                                handleSubOption(2)
                                handleCompany('스펙정보')
                                handleItem(itemName)
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
                                    option: 0,
                                    subOption: 2
                                }
                                handleLoading(false)
                                messageSend(message)
                                Keyboard.dismiss()
                            }).catch((err) => {
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
                                handleLoading(false)
                                messageSend(message)
                            })
                        }).catch((err) => {
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
                            handleLoading(false)
                            messageSend(message)
                        })
                } // 업차지 끝
            } // 아이템 정보 끝

        }
        
    }

    if (text === '처음 단계로' || option === 5) {
        text = '처음으로 돌아갑니다.';
        create(text, 0, 0, 1)
    }


    return message
}

export default createMessage;