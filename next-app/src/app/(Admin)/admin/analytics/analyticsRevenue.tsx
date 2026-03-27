import { Line } from "@antv/g2plot";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { Column } from "@antv/g2plot";
import CardDataStats from "@/components/Card/DataCard";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { RevenueType } from "@/types";
import { getAnalyticsRevenue, makeRequestApi } from "@/lib/api";
import { useSession } from "next-auth/react";
import { UpdateRevenuePage } from "@/app/redux/features/analyticsData";


const AppRevenue: React.FC = () => {
  const [typeLine, setTypeLine] = useState('revenue')
  const handleSelect = (value: string) => {
    setTypeLine(value);
  };

  const dataRevenuePage = useAppSelector((state) => state.AnalyticData.dataRevenuePage)
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  useEffect(() => {
    console.log(session)
    const fetchData = async () => {
      const responseData: RevenueType = await makeRequestApi(getAnalyticsRevenue, null, session?.refresh_token, session?.access_token)
      dispatch(
        UpdateRevenuePage({ value: responseData })
      )
    };
    fetchData();
  }, [dispatch]);

  const columnContainerRef = useRef<HTMLDivElement | null>(null);
  const lineContainerRef = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    let line: Line | null = null;
    let stackedColumnPlot: Column | null = null;

    if (dataRevenuePage?.dataMonth.length > 0 && lineContainerRef.current) {
      line = new Line(lineContainerRef.current, {
        data: dataRevenuePage.dataMonth,
        padding: "auto",
        xField: "Date",
        yField: typeLine,
        xAxis: {
          tickCount: 5,
        },
        slider: {
          start: 0,
          end: 1,
        },
      });

      line.render();
    }

    if (dataRevenuePage?.dataWeek.length > 0 && columnContainerRef.current) {
      stackedColumnPlot = new Column(columnContainerRef.current, {
        data: dataRevenuePage.dataWeek,
        isGroup: true,
        xField: 'xData',
        yField: 'yData',
        seriesField: 'name',
        /** 设置颜色 */
        //color: ['#1ca9e6', '#f88c24'],
        /** 设置间距 */
        // marginRatio: 0.1,
        label: {
          // 可手动配置 label 数据标签位置
          position: 'middle', // 'top', 'middle', 'bottom'
          // 可配置附加的布局方法
          layout: [
            // 柱形图数据标签位置自动调整
            { type: 'interval-adjust-position' },
            // 数据标签防遮挡
            { type: 'interval-hide-overlap' },
            // 数据标签文颜色自动调整
            { type: 'adjust-color' },
          ],
        },
      });

      stackedColumnPlot.render();
    }

    return () => {
      if (line) {
        line.destroy();
      }
      if (stackedColumnPlot) {
        stackedColumnPlot.destroy();
      }
    };
  }, [dataRevenuePage, typeLine]);

  return (
    <>
      <div className="grid grid-cols-1 m-[50px] gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Total Revenue"
          total={`${dataRevenuePage?.dataAllTime.totalRevenue.toLocaleString('vi-VN')}đ`}
          levelUp
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 fill-primary dark:fill-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Total Profit"
          total={`${dataRevenuePage?.dataAllTime.totalProfit.toLocaleString('vi-VN')}đ`}
          levelUp
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 fill-primary dark:fill-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Total Product Sold"
          total={`${dataRevenuePage?.dataAllTime.totalProduct.toFixed(0)}`}
          levelUp
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 fill-primary dark:fill-white"

          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Total Order"
          total={`${dataRevenuePage?.dataAllTime.totalOrder.toFixed(0)}`}
          levelUp
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 fill-primary dark:fill-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>


        </CardDataStats>
      </div>
      <div className="font-bold text-lg mt-[50px]">
        Biểu đồ danh thu theo tháng và năm
        <div className="dropdown" data-theme="light">
          <div tabIndex={0} role="button" className="btn m-1">
            Kiểu dữ liệu: {typeLine}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <a onClick={() => handleSelect('revenue')}>Doanh thu</a>
            </li>
            <li>
              <a onClick={() => handleSelect('profit')}>Lợi nhuận</a>
            </li>
            <li>
              <a onClick={() => handleSelect('productSold')}>Số lượng sản phẩm bán</a>
            </li>
          </ul>
        </div>
      </div>
      <div
        ref={lineContainerRef}
        id="containerLineRevenue"
        style={{ width: "90%", height: "400px", margin: "50px" }}
      ></div>
      <div className="font-bold text-lg mt-[50px]">
        Biểu đồ danh thu theo tuần
      </div>
      <div
        ref={columnContainerRef}
        id="containerColumRevenue"
        style={{ width: "90%", height: "400px", margin: "50px" }}
      ></div>
    </>
  );
};

export default AppRevenue;
