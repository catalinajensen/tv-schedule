export interface IChannel {
  id: string;
  images: IImage;
  schedules: ISchedule[];
  title: string;
}

export interface IImage {
  logo: string;
}

export interface ISchedule {
  end: string;
  id: string;
  start: string;
  title: string;
}
