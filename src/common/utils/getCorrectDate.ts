import dayjs from 'dayjs';

const getCorrectDate = (date: Date): Date => {
    const timezomeOffset = date.getTimezoneOffset() * 60000;
    return dayjs(Number(date) - timezomeOffset).toDate();
};

export default getCorrectDate;
