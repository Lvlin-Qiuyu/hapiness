'use client'

import {useState, useMemo} from 'react';
import {Select, SelectItem, RadioGroup, Radio} from "@nextui-org/react";

const yearList = [];
for (let i = 1930; i <= new Date().getFullYear(); i++) {
    yearList.push(String(i));
}
const monthList = [];
for (let i = 1; i <= 12; i++) {
    monthList.push(String(i));
}

export default function App() {

    const [birthYear, setBirthYear] = useState(new Set(['1996']));
    const [birthMonth, setBirthMonth] = useState(new Set(['2']));
    const [sex, setSex] = useState('male'); // male female
    const [femaleRetireAge, setFemaleRetireAge] = useState(50); // 55

    const retireAge = sex === 'male' ? 60 : femaleRetireAge;
    const birthYearNum = +[...birthYear][0];
    const birthMonthNum = +[...birthMonth][0];
    
    // 推迟月份数
    const retireDelayMonths = useMemo(() => {
        // 原退休时间，减去2025年，计算出月数，每三个月推迟一个月
        const retireYear = birthYearNum + retireAge;
        if (retireYear >= 2025) {
            const delayBase = sex === 'male' || femaleRetireAge === 55 ? 4 : 2;
            const delayMonths = Math.ceil(((retireYear - 2025) * 12 + birthMonthNum) / delayBase);
            const maxMonth = (sex === 'male' || femaleRetireAge === 55) ? 36 : 60;
            return delayMonths > maxMonth ? maxMonth : delayMonths;
        } else {
            return 0;
        }
    }, [
        birthYear,
        birthMonth,
        sex,
        femaleRetireAge
    ]);

    // 具体退休时间
    const realRetireYear = birthYearNum + retireAge + Math.floor((birthMonthNum + retireDelayMonths - 1) / 12);
    let realRetireMonth = (birthMonthNum + retireDelayMonths) % 12;
    if (realRetireMonth === 0) realRetireMonth = 12;

    // 具体年龄
    const realAge = realRetireMonth >= birthMonthNum ? realRetireYear - birthYearNum : realRetireYear - birthYearNum - 1;

    console.log({
        realRetireMonth,
        birthMonthNum
    })

    return (
        <div className='min-w-[450px] bg-gray-100 min-h-screen max-h-full flex flex-wrap'>
            <div className='min-w-[400px] w-[800px] m-10 p-2 border border-black rounded-lg bg-white'>
                <p className='text-center'>退休计算器</p>

                <div className='m-5 p-5 border border-blue-500 rounded-lg bg-blue-50'>
                    <p className="mb-2">出生日期</p>
                    <div className="flex flex-wrap-n">
                        <Select
                            label="出生年份"
                            variant="bordered"
                            className="max-w-xs bg-white rounded-xl"
                            selectedKeys={birthYear}
                            onSelectionChange={setBirthYear}
                        >
                            {yearList.map((year) => (
                                <SelectItem key={year} textValue={year}>
                                    {year}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            label="出生月份"
                            variant="bordered"
                            className="max-w-xs ml-4 bg-white rounded-xl"
                            selectedKeys={birthMonth}
                            onSelectionChange={setBirthMonth}
                        >
                            {monthList.map((month) => (
                                <SelectItem key={month} textValue={month}>
                                    {month}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>

                <div className='m-5 p-5 border border-yellow-500 rounded-lg bg-yellow-50'>
                    <p className="mb-2">性别</p>
                    <RadioGroup
                        orientation="horizontal"
                        value={sex}
                        onValueChange={setSex}
                    >
                        <Radio value="male">男</Radio>
                        <Radio value="female">女</Radio>
                    </RadioGroup>
                </div>

                {
                    sex === 'female' && (
                        <div className='m-5 p-5 border border-red-500 rounded-lg bg-red-50'>
                            <p className="mb-2">原法定退休年龄</p>
                            <RadioGroup
                                orientation="horizontal"
                                value={femaleRetireAge}
                                onValueChange={setFemaleRetireAge}
                            >
                                <Radio value={50}>50 周岁</Radio>
                                <Radio value={55}>55 周岁</Radio>
                            </RadioGroup>
                        </div>
                    )
                }

                <div className='m-5 p-5 border border-green-500 rounded-lg bg-green-50'>
                    <p className="mb-2">计算结果</p>
                    <div className="grid grid-cols-2 gap-y-2">
                        <span>改革后退休时间</span><span>{`${realRetireYear} 年 ${realRetireMonth} 月`}</span> 
                        <span>法定延迟退休年龄</span><span>{realAge} 岁</span>
                        <span>延迟月份</span><span>{retireDelayMonths} 个月</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
