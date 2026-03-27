import { Column } from '@antv/g2plot';
import React, { useEffect, useRef, useState } from 'react';
import { Pie } from '@antv/g2plot';
import TableTop from '@/components/Table/topTable';
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { FavoriteType } from "@/types";
import { getAnalyticsFavorite, getAnalyticsRevenue, makeRequestApi } from "@/lib/api";
import { useSession } from "next-auth/react";
import { UpdateFavoritePage } from "@/app/redux/features/analyticsData";

const AppFavorite: React.FC = () => {
    const dataFavoritePage = useAppSelector((state) => state.AnalyticData.dataFavoritePage)
    const dispatch = useAppDispatch()
    const { data: session } = useSession()
    
    useEffect(() => {
      console.log(session)
      const fetchData = async () => {
        const responseData: FavoriteType = await makeRequestApi(getAnalyticsFavorite, null, session?.refresh_token, session?.access_token)
        dispatch(
          UpdateFavoritePage({ value: responseData })
        )
      };
      fetchData();
    }, [dispatch]);
  
    const columnContainerRef = useRef<HTMLDivElement | null>(null);
    const pieContainerRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        let pie: Pie | null = null;
        let column: Column | null = null;

        if (dataFavoritePage.dataSex.length > 0 && pieContainerRef.current) {
            pie = new Pie(pieContainerRef.current, {
                appendPadding: 10,
                data: dataFavoritePage.dataSex,
                angleField: 'value',
                colorField: 'type',
                radius: 0.9,
                label: {
                    type: 'inner',
                    offset: '-30%',
                    content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                    style: {
                        fontSize: 14,
                        textAlign: 'center',
                    },
                },
                interactions: [{ type: 'element-active' }],
            });

            pie.render();
        }

        if (dataFavoritePage.dataBrand.length > 0 && columnContainerRef.current) {
            column = new Column(columnContainerRef.current, {
                data: dataFavoritePage.dataBrand,
                xField: 'type',
                yField: 'value',
                xAxis: {
                    label: {
                        autoHide: true,
                        autoRotate: false,
                    },
                },
                meta: {
                    type: {
                        alias: '类别',
                    },
                    sales: {
                        alias: '销售额',
                    },
                },
                minColumnWidth: 20,
                maxColumnWidth: 20,
            });

            column.render();
        }

        return () => {
            if (pie) {
                pie.destroy();
            }
            if (column) {
                column.destroy();
            }
        };
    }, [dataFavoritePage]);

    return (
        <>
            <div className='font-bold text-lg mt-[50px]'>Biểu đồ xu hướng của mua hàng theo hãng nước hoa</div>
            <div ref={columnContainerRef} id="containerColumProduct" style={{ width: '90%', height: '400px', margin: '50px' }}></div>
            <div className='font-bold text-lg mt-[50px]'>Biểu đồ xu hướng của mua hàng theo giới tính</div>
            <div ref={pieContainerRef} id="containerPieProduct" style={{ width: '90%', height: '400px', margin: '50px' }}></div>
            <div className='m-[50px]'><TableTop productData={dataFavoritePage.dataProduct}></TableTop></div>
        </>
    );
};

export default AppFavorite;
