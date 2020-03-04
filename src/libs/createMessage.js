import { Keyboard } from 'react-native';
import { callNumber } from './calling';

function createMessage(text, option, subOption, item, role, c) {

    let message;
    let quick;

    const companys = [
        '영우직영',
        '영우본사',
        'ORS'
    ]

    role='customer'
    if(role !== 'employee'){
        company = c;
    }

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
                ],
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
            company: company
        }
    }

    // 현물조회
    if (text === '현물조회') {
        if (role === 'employee') {
            text = '아이템명(또는 아이템 번호)과\n칼라번호 입력\n\n예) 거북선(또는 7-8042)\n9080\n\n(전체 칼라를 원할 경우 아이템\n명만 입력)';
            option = 1;
            subOption = 1;
            create(text, option, subOption);
        }
        if (role === 'customer') {
            text = '아이템명(또는 아이템번호) 조\n회 후 칼라번호 조회\n예) 거북선(또는 7-8042)';
            option = 1;
            subOption = 2;
            create(text, option, subOption);
        }
    }
    if (option === 1 && subOption === 1 && text.length < 15) {
        let strArr = text.split(' ');
        let color = (strArr[1] === undefined ? ' 전체컬러' : ` ${strArr[1]}`);

        text = `${strArr[0]}${color} 수량`
        option = 0;
        subOption = 0;
        quick = 1;
        create(text, option, subOption, quick)
        Keyboard.dismiss()
    }
    if (option === 1 && subOption === 2 && text.length < 15) {
        let item = text;
        let colorList = '칼라리스트';

        text = `${item}\n칼라리스트\n\n${colorList}\n\n조회를 원하시는 칼라 번호를\n입력해주세요.`
        option = 1;
        subOption = 3;
        create(text, option, subOption, undefined, item)
    }

    if (option === 1 && subOption === 3 && text.length < 15) {
        let color = text;
        let quantity = '수량정보';

        text = `${item}\n${color}\n${quantity}`
        option = 0;
        subOption = 0;
        quick = 5;
        create(text, option, subOption, quick);
        Keyboard.dismiss()
    }
    if (text === '빠른수배 요청') {
        text = '빠른 수배 요청을 위해 담당자\n에게 전화를 겁니다.';
        quick = 5;
        let number = '01027974729';
        create(text, option, subOption, quick)
        callNumber(number)
    }

    // 샘플신청
    if (text === '샘플신청') {
        if (role === 'customer') {
            option = 2;
            subOption = 2;
            create(text, option, subOption)
        }
        if (role === 'employee') {
            text = '샘플신청 입니다.\n\n거래처 명을 입력하세요';
            option = 2;
            subOption = 1;
            create(text, option, subOption)
        }
    }
    if (option === 2 && subOption === 2) {
        text = '원하시는 아이템명, 컬러명, 수\n량을 입력해주세요.\n\n예시) 거북선 9080 10 또는\n7-8042 9080 10';
        option = 2;
        subOption = 3;
        create(text, option, subOption)
    }

    if (option === 2 && subOption === 1 && text.length < 10) {
        let companyList = [];

        companys.map(company => {
            if (company.indexOf(text) > -1) {
                companyList.push(company)
            }
        })
        if (companyList.length === 1) {
            company = text;
            text = `${text}을/를 선택하셨습니다.`;
            option = 2;
            subOption = 2;
            create(text, option, subOption, quick, undefined, undefined, company)
        }
        else {
            text = '해당하는 거래처를 선택해주세요';
            let list = companyList;
            option = 2;
            subOption = 1;
            create(text, option, subOption, undefined, undefined, list);
            Keyboard.dismiss()
        }
        if (companyList.length === 0) {
            text = '해당하는 거래처명이 없습니다.\n다시 검색해주세요.'
            option = 2;
            subOption = 1;
            create(text, option, subOption)
        }
    }


    if (option === 2 && subOption === 3 && text.length < 25) {
        let strArr = text.split(' ');
        text = '배송방법을 선택해주세요.';
        option = 2;
        subOption = 4;
        quick = 3;
        item = strArr;
        create(text, option, subOption, quick, item)
        Keyboard.dismiss()
    }
    if (option === 2 && subOption ===4 && text.length < 10) {
        let method = text;
        let price = '8,200';
        let time = '3타임';
        option = 2;
        subOption = 5;
            text = `${company}

=====주문내역=====
${item[0]} / ${item[1]} /
${item[2]}YD 단가 ${price}원
        

======배송======
${method} ${time}
        
신청하신 내용이 맞습니까?`
        quick = 4;
        create(text, option, subOption, quick)
    }

    if (text === '네, 주문완료' || text === '네, 전달사항 추가' || text === '아니요, 다시입력') {
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
    if (option === 3 && subOption === 1 && role === 'customer' && text.length < 10) {
        let item = text;
        text = `${item} 스펙`
        option = 0;
        quick = 1;
        create(text, option, 0, quick)
    }
    if (option === 3 && subOption === 1 && role === 'employee' && text.length < 10) {
        let item = text;
        text = '조회 항목을 선택해 주세요.';
        option = 3;
        subOption = 2;
        quick = 2;
        create(text, option, subOption, quick, item)
        Keyboard.dismiss()
    }
    if (text === '업차지' && option === 3 && subOption === 2) {
        text = `${item} 업차지`;
        option = 3;
        subOption = 2;
        quick = 2;
        create(text, option, subOption, quick, item)
        Keyboard.dismiss()
    }
    if (text === '스펙과 단가' && option === 3 && subOption === 2) {
        text = `${item}의 스펙과 단가`;
        option = 3;
        subOption = 2;
        quick = 2;
        create(text, option, subOption, quick, item);
        Keyboard.dismiss()
    }
    if (text === '처음 단계로' || option ===5) {
        text = '처음으로 돌아갑니다.';
        create(text, 0, 0, 1)
    }

    return message
}

export default createMessage;