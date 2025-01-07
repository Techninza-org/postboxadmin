"use client"
import Loading from '@/components/loading';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react'

const CustomPage = () => {
    const [price, setPrice] = useState(0);
    const [limit, setLimit] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const token = getCookie("authtoken");

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://postbox.biz/api/admin/getCustomInputs", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPrice(response.data.customInput.ADVERTISEMENT_PRICE_PER_USER_PER_HOUR);
            setLimit(response.data.customInput.RADIUS_LIMIT_FOR_HOME_AND_WORK_LOCATION);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    async function handleUpdateInputs(){
        try{
            const response = await axios.post("https://postbox.biz/api/admin/setCustomInputs", {
                ADVERTISEMENT_PRICE_PER_USER_PER_HOUR: price,
                RADIUS_LIMIT_FOR_HOME_AND_WORK_LOCATION: limit
            },{
                headers: { Authorization: `Bearer ${token}` },
            });
            if(response.data.status === 200) alert('Updated successfully');
        }catch(err){
            console.log(err);
        }
    }


    if (loading) {
        return <Loading />;
    }
    return (
        <div className='mt-20 ml-8 flex gap-10'>
            <div className='border-2 border-black rounded-lg p-8 grid gap-4'>
                <label htmlFor="price" className='font-bold text-xl uppercase'>Price / user / hour</label>
                <input type="number" id="price" name="price" value={price} onChange={(e) => setPrice(Number(e.target.value))} className='border-2 border-gray-700 rounded-lg p-2' />
                <button type='button' className='bg-blue-600 text-white w-[max-content] rounded-lg p-2' onClick={() => handleUpdateInputs()}>Save</button>
            </div>
            <div className='border-2 border-black rounded-lg p-8 grid gap-4'>
                <label htmlFor="limit" className='font-bold text-xl uppercase'>Radius Limit</label>
                <input type="number" id="limit" name="limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))} className='border-2 border-gray-700 rounded-lg p-2' />
                <button type='button' className='bg-blue-600 text-white w-[max-content] rounded-lg p-2' onClick={() => handleUpdateInputs()}>Save</button>
            </div>
        </div>
    )
}

export default CustomPage
