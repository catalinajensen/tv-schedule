import { useEffect, useRef, useState } from 'react';
import { IChannel, ISchedule } from '../types';
import './Schedule.css';

interface IProps {
  channels: IChannel[];
  time: Date;
}

const Schedule = ({ channels, time }: IProps) => {
  const elementRef = useRef<HTMLTableElement>(null);
  const [hours, setHours] = useState<number[]>([]);
  const [currentGrid, setCurrentGrid] = useState<number>(0);

  const getDisplayTime = (start: string, end: string): string => {
    const startTime = new Date(start).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    const endTime = new Date(end).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${startTime} - ${endTime}`;
  };

  const getWidthByDisplayTime = (start: string, end: string): number => {
    const displayTimeInMinutes =
      (new Date(end).getTime() - new Date(start).getTime()) / 60000;

    return displayTimeInMinutes;
  };

  const getGridColumnByStartTime = (start: string): number => {
    const startDate = new Date(start);

    const minutes = startDate.getMinutes();
    const hours = startDate.getHours();

    const totalMin = 60 * hours + minutes;
    return totalMin;
  };

  const handleOnClickNow = (): void => {
    const element = document.getElementsByClassName('on')[0];

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  };

  const updateStyleByTime = (time: Date): void => {
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const totalMin = 60 * hours + minutes;

    setCurrentGrid(totalMin);
  };

  useEffect(() => {
    const hours = [];

    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }

    setHours(hours);
  }, []);

  useEffect(() => {
    updateStyleByTime(time);
  }, [time]);

  return (
    <div className="schedule-container" ref={elementRef}>
      <button className="now-button" onClick={() => handleOnClickNow()}>
        Now
      </button>
      <table className="schedule">
        <tbody>
          <tr>
            <th className="channel"></th>
            <td className="timespan">
              {hours.map((hour: number) => {
                const isLineVisible =
                  currentGrid >= hour * 60 && currentGrid <= (hour + 1) * 60;

                return (
                  <div className="hour" key={hour}>
                    {currentGrid >= 0 && isLineVisible && (
                      <div
                        className="line"
                        style={{ paddingLeft: (currentGrid - hour * 60) * 5 }}
                      ></div>
                    )}
                    {`${hour}:00`}
                  </div>
                );
              })}
            </td>
          </tr>
          {channels.map((chanell: IChannel) => {
            return (
              <tr
                className="channel-row"
                key={chanell.id}
                data-testid="channel-row"
              >
                <th className="channel">
                  <span className="channel-title">{chanell.title}</span>
                </th>
                <td className="show">
                  {chanell.schedules.map((schedule: ISchedule, index) => {
                    const widthByMinutes = getWidthByDisplayTime(
                      schedule.start,
                      schedule.end
                    );
                    const gridColumnByStartTime = getGridColumnByStartTime(
                      schedule.start
                    );
                    const cellStyleWidth = {
                      width: widthByMinutes * 5
                    };

                    const cellStyleGridColumn = {
                      gridColumn: gridColumnByStartTime
                    };

                    const endTime = gridColumnByStartTime + widthByMinutes;

                    let extraClassName = '';

                    if (
                      currentGrid >= gridColumnByStartTime &&
                      currentGrid < endTime
                    ) {
                      extraClassName = 'on';
                    }

                    return (
                      <div
                        key={index}
                        className={`show-details ${extraClassName}`}
                        style={{
                          ...cellStyleWidth,
                          ...cellStyleGridColumn
                        }}
                        id={`id-${gridColumnByStartTime}`}
                      >
                        <span className="title">{schedule.title}</span>
                        <span className="subtitle">
                          {getDisplayTime(schedule.start, schedule.end)}
                        </span>
                      </div>
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;
