import { Keyboard } from 'react-native';

function createMessage(text, option, item) {

    let message;

    const quickReply = [
        '현물조회',
        '샘플신청',
        '아이템 정보',
        '업차지',
        '스펙과 단가',
        '처음화면'
    ]

    const create = (text, option, quick, item) => {
        let quickReplies;

        if (quick === 1) {
            quickReplies = {
                type: 'radio',
                values: [
                    {
                        title: '현물조회',
                        value: 'inquiry',
                    },
                    {
                        title: '샘플신청',
                        value: 'sample',
                    },
                    {
                        title: '아이템 정보',
                        value: 'item',
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
                        title: '처음화면',
                        value: '처음화면',
                    },
                ],
            }
        }
        message = {
            createdAt: new Date(),
            _id: Math.round(Math.random() * 1000000),
            text: text,
            user: 2,
            quickReplies,
            option: option,
            item: item,
        }
    }

    if (text === '현물조회') {
        text = '아이템명(또는 아이템 번호)과\n칼라번호 입력\n\n예) 거북선(또는 7-8042)\n9080\n\n(전체 칼라를 원할 경우 아이템\n명만 입력)';
        option = 1;
        focus = true;
        create(text, option)
    }
    if (text === '샘플신청') {
        text = '샘플신청 입니다.\n\n거래처 명을 입력하세요';
        option = 2;
        focus = true;
        create(text, option)
    }
    if (text === '아이템 정보') {
        text = '정보 조회를 원하는 아이템명을\n입력해주세요.';
        option = 3;
        focus = true;
        create(text, option)
    }
    if (option === 1 && !quickReply.includes(text) && text.length < 10) {
        let strArr = text.split(' ');
        let color = (strArr[1] === undefined ? ' 전체컬러' : ` ${strArr[1]}`);

        text =`${strArr[0]}${color} 수량`
        option = 0;
        quick = 1;
        create(text,option,quick)
        Keyboard.dismiss()
    }
    if (option === 2 && !quickReply.includes(text) && text.length < 10) {
        console.log('샘플신청')
        console.log(`회사명 : ${text}`);
    }
    if (option === 3 && !quickReply.includes(text) && text.length < 10) {
        item = text;
        text = '조회 항목을 선택해 주세요.';
        option = 3;
        quick = 2;
        create(text,option,quick, item)
        Keyboard.dismiss()
    }
    if (text === '업차지') {
        text = `${item} 업차지`;
        option = 0;
        quick = 2;
        create(text,option,quick,item)
        Keyboard.dismiss()
    }
    if (text === '스펙과 단가') {
        text = `${item}의 스펙과 단가`;
        option = 0;
        quick = 2;
        create(text, option, quick, item);
        Keyboard.dismiss()
    }
    if (text === '처음화면') {
        text = '처음으로 돌아갑니다.';
        create(text,0,1)
    }
    return message
}

export default createMessage;