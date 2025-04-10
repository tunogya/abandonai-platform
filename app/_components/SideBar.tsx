"use client";
import Image from "next/image"
import {usePathname} from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import {useTranslations} from 'next-intl';
import {createLoginLink} from "@/app/_lib/actions";
import {useState} from "react";

const SideBar = ({
                   connectedAccountId
                 }: {
  connectedAccountId: string
}) => {
  const pathname = usePathname();
  const t = useTranslations('Menu');
  const [status, setStatus] = useState("idle");
  const [connectLink, setConnectLink] = useState("");

  const menu = [
    {
      name: t("Messages"),
      icon: <svg aria-label="Messenger" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img"
                 viewBox="0 0 24 24" width="24">
        <path
          d="M12.003 2.001a9.705 9.705 0 1 1 0 19.4 10.876 10.876 0 0 1-2.895-.384.798.798 0 0 0-.533.04l-1.984.876a.801.801 0 0 1-1.123-.708l-.054-1.78a.806.806 0 0 0-.27-.569 9.49 9.49 0 0 1-3.14-7.175 9.65 9.65 0 0 1 10-9.7Z"
          fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.739"></path>
        <path
          d="M17.79 10.132a.659.659 0 0 0-.962-.873l-2.556 2.05a.63.63 0 0 1-.758.002L11.06 9.47a1.576 1.576 0 0 0-2.277.42l-2.567 3.98a.659.659 0 0 0 .961.875l2.556-2.049a.63.63 0 0 1 .759-.002l2.452 1.84a1.576 1.576 0 0 0 2.278-.42Z"
          fillRule="evenodd"></path>
      </svg>,
      activeIcon: <svg aria-label="Messenger" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24"
                       role="img" viewBox="0 0 24 24" width="24">
        <path
          d="M12.003 1.131a10.487 10.487 0 0 0-10.87 10.57 10.194 10.194 0 0 0 3.412 7.771l.054 1.78a1.67 1.67 0 0 0 2.342 1.476l1.935-.872a11.767 11.767 0 0 0 3.127.416 10.488 10.488 0 0 0 10.87-10.57 10.487 10.487 0 0 0-10.87-10.57Zm5.786 9.001-2.566 3.983a1.577 1.577 0 0 1-2.278.42l-2.452-1.84a.63.63 0 0 0-.759.002l-2.556 2.049a.659.659 0 0 1-.96-.874L8.783 9.89a1.576 1.576 0 0 1 2.277-.42l2.453 1.84a.63.63 0 0 0 .758-.003l2.556-2.05a.659.659 0 0 1 .961.874Z"></path>
      </svg>,
      path: "/home",
    },
    // {
    //   name: "搜索",
    //   icon: <svg aria-label="搜索" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img"
    //              viewBox="0 0 24 24" width="24"><title>搜索</title>
    //     <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor"
    //           strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
    //     <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
    //           x1="16.511" x2="22" y1="16.511" y2="22"></line>
    //   </svg>,
    //   activeIcon: <svg aria-label="搜索" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24"
    //                    role="img" viewBox="0 0 24 24" width="24"><title>搜索</title>
    //     <path d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z" fill="none" stroke="currentColor" strokeLinecap="round"
    //           strokeLinejoin="round" strokeWidth="3"></path>
    //     <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
    //           x1="16.511" x2="21.643" y1="16.511" y2="21.643"></line>
    //   </svg>,
    //   path: "",
    // },
    // {
    //   name: "发现",
    //   icon: <svg aria-label="发现" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img"
    //              viewBox="0 0 24 24" width="24"><title>发现</title>
    //     <polygon fill="none" points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953"
    //              stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
    //     <polygon fillRule="evenodd" points="10.06 10.056 13.949 13.945 7.581 16.424 10.06 10.056"></polygon>
    //     <circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" strokeLinecap="round"
    //             strokeLinejoin="round" strokeWidth="2"></circle>
    //   </svg>,
    //   activeIcon: <svg aria-label="发现" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24"
    //                    role="img" viewBox="0 0 24 24" width="24"><title>发现</title>
    //     <path
    //       d="m13.173 13.164 1.491-3.829-3.83 1.49ZM12.001.5a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12.001.5Zm5.35 7.443-2.478 6.369a1 1 0 0 1-.57.569l-6.36 2.47a1 1 0 0 1-1.294-1.294l2.48-6.369a1 1 0 0 1 .57-.569l6.359-2.47a1 1 0 0 1 1.294 1.294Z"></path>
    //   </svg>,
    //   path: "",
    // },
    // {
    //   name: "消息",
    //   icon: <svg aria-label="Messenger" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img"
    //              viewBox="0 0 24 24" width="24"><title>Messenger</title>
    //     <path
    //       d="M12.003 2.001a9.705 9.705 0 1 1 0 19.4 10.876 10.876 0 0 1-2.895-.384.798.798 0 0 0-.533.04l-1.984.876a.801.801 0 0 1-1.123-.708l-.054-1.78a.806.806 0 0 0-.27-.569 9.49 9.49 0 0 1-3.14-7.175 9.65 9.65 0 0 1 10-9.7Z"
    //       fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.739"></path>
    //     <path
    //       d="M17.79 10.132a.659.659 0 0 0-.962-.873l-2.556 2.05a.63.63 0 0 1-.758.002L11.06 9.47a1.576 1.576 0 0 0-2.277.42l-2.567 3.98a.659.659 0 0 0 .961.875l2.556-2.049a.63.63 0 0 1 .759-.002l2.452 1.84a1.576 1.576 0 0 0 2.278-.42Z"
    //       fillRule="evenodd"></path>
    //   </svg>,
    //   activeIcon: <svg aria-label="Messenger" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24"
    //                    role="img" viewBox="0 0 24 24" width="24"><title>Messenger</title>
    //     <path
    //       d="M12.003 1.131a10.487 10.487 0 0 0-10.87 10.57 10.194 10.194 0 0 0 3.412 7.771l.054 1.78a1.67 1.67 0 0 0 2.342 1.476l1.935-.872a11.767 11.767 0 0 0 3.127.416 10.488 10.488 0 0 0 10.87-10.57 10.487 10.487 0 0 0-10.87-10.57Zm5.786 9.001-2.566 3.983a1.577 1.577 0 0 1-2.278.42l-2.452-1.84a.63.63 0 0 0-.759.002l-2.556 2.049a.659.659 0 0 1-.96-.874L8.783 9.89a1.576 1.576 0 0 1 2.277-.42l2.453 1.84a.63.63 0 0 0 .758-.003l2.556-2.05a.659.659 0 0 1 .961.874Z"></path>
    //   </svg>,
    //   path: "",
    // },
    {
      name: t("Series"),
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 12.001V15.45C2 18.299 2.698 19.456 3.606 20.395C4.546 21.303 5.704 22.002 8.552 22.002H15.448C18.296 22.002 19.454 21.303 20.394 20.395C21.302 19.456 22 18.299 22 15.45V8.552C22 5.704 21.302 4.546 20.394 3.607C19.454 2.699 18.296 2 15.448 2H8.552C5.704 2 4.546 2.699 3.606 3.607C2.698 4.546 2 5.704 2 8.552V12.001Z"
          stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path
          d="M13.1034 14.6913C13.0781 15.0079 12.9577 15.2359 12.7424 15.3753C12.5397 15.5146 12.3117 15.5716 12.0584 15.5463C11.8051 15.5083 11.5897 15.4006 11.4124 15.2233C11.2477 15.0459 11.1781 14.8053 11.2034 14.5013C11.2161 14.4253 11.2351 14.2226 11.2604 13.8933C11.2857 13.6526 11.3111 13.4626 11.3364 13.3233C11.4124 12.9433 11.5897 12.5063 11.8684 12.0123C12.0711 11.6576 12.4067 11.2459 12.8754 10.7773C12.9134 10.7519 13.0654 10.6126 13.3314 10.3593L13.9204 9.77027C14.4777 9.16227 14.6931 8.64927 14.5664 8.23127C14.4651 7.8766 14.2561 7.5916 13.9394 7.37627C13.6227 7.16093 13.2554 7.0216 12.8374 6.95827C12.4321 6.88227 12.0204 6.87593 11.6024 6.93927C11.1844 7.0026 10.8171 7.14193 10.5004 7.35727C10.1964 7.55993 9.99373 7.8386 9.8924 8.19327L9.9114 8.32627C9.9114 8.33893 9.9114 8.3516 9.9114 8.36427C9.9114 8.37693 9.9114 8.39593 9.9114 8.42127L9.9494 8.49727C9.9494 8.50993 9.9494 8.5226 9.9494 8.53527C9.9494 8.54793 9.9494 8.5606 9.9494 8.57327C9.97473 8.7126 9.99373 8.83293 10.0064 8.93427C10.0191 9.25093 9.93673 9.49793 9.7594 9.67527C9.58207 9.83993 9.36673 9.9286 9.1134 9.94127C8.87273 9.95393 8.65107 9.8906 8.4484 9.75127C8.24573 9.61193 8.13173 9.39027 8.1064 9.08627C8.1064 9.0356 8.10007 8.97227 8.0874 8.89627C8.0494 8.71893 8.0304 8.62393 8.0304 8.61127C7.97973 8.26927 7.9924 7.96527 8.0684 7.69927C8.23307 7.0786 8.54973 6.55293 9.0184 6.12227C9.4744 5.70427 9.97473 5.41293 10.5194 5.24827C11.0641 5.07093 11.6277 4.9886 12.2104 5.00127C12.7931 5.00127 13.3567 5.08993 13.9014 5.26727C14.4461 5.4446 14.9464 5.74227 15.4024 6.16027C15.8711 6.57827 16.2004 7.0786 16.3904 7.66127C16.7324 8.7886 16.3651 9.92227 15.2884 11.0623C15.1997 11.1763 15.0921 11.2966 14.9654 11.4233L14.5474 11.8033C14.3954 11.9426 14.2814 12.0503 14.2054 12.1263C13.8634 12.4683 13.6291 12.7469 13.5024 12.9623C13.3377 13.2663 13.2364 13.5069 13.1984 13.6843C13.1857 13.7603 13.1731 13.8806 13.1604 14.0453C13.1224 14.3999 13.1034 14.6153 13.1034 14.6913ZM12.9134 17.0093C13.1414 17.2246 13.2427 17.4526 13.2174 17.6933C13.1921 17.9339 13.0907 18.1493 12.9134 18.3393C12.7361 18.5166 12.5207 18.6179 12.2674 18.6433C12.0267 18.6686 11.7987 18.5673 11.5834 18.3393C11.3554 18.1239 11.2541 17.8959 11.2794 17.6553C11.3047 17.4019 11.4061 17.1866 11.5834 17.0093C11.7734 16.8319 11.9887 16.7306 12.2294 16.7053C12.4701 16.6799 12.6981 16.7813 12.9134 17.0093Z"
          fill="black"/>
      </svg>
      ,
      activeIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 12.001V15.45C2 18.299 2.698 19.456 3.606 20.395C4.546 21.303 5.704 22.002 8.552 22.002H15.448C18.296 22.002 19.454 21.303 20.394 20.395C21.302 19.456 22 18.299 22 15.45V8.552C22 5.704 21.302 4.546 20.394 3.607C19.454 2.699 18.296 2 15.448 2H8.552C5.704 2 4.546 2.699 3.606 3.607C2.698 4.546 2 5.704 2 8.552V12.001Z"
          fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path
          d="M13.1034 14.6913C13.0781 15.0079 12.9577 15.2359 12.7424 15.3753C12.5397 15.5146 12.3117 15.5716 12.0584 15.5463C11.8051 15.5083 11.5897 15.4006 11.4124 15.2233C11.2477 15.0459 11.1781 14.8053 11.2034 14.5013C11.2161 14.4253 11.2351 14.2226 11.2604 13.8933C11.2857 13.6526 11.3111 13.4626 11.3364 13.3233C11.4124 12.9433 11.5897 12.5063 11.8684 12.0123C12.0711 11.6576 12.4067 11.2459 12.8754 10.7773C12.9134 10.7519 13.0654 10.6126 13.3314 10.3593L13.9204 9.77027C14.4777 9.16227 14.6931 8.64927 14.5664 8.23127C14.4651 7.8766 14.2561 7.5916 13.9394 7.37627C13.6227 7.16093 13.2554 7.0216 12.8374 6.95827C12.4321 6.88227 12.0204 6.87593 11.6024 6.93927C11.1844 7.0026 10.8171 7.14193 10.5004 7.35727C10.1964 7.55993 9.99373 7.8386 9.8924 8.19327L9.9114 8.32627C9.9114 8.33893 9.9114 8.3516 9.9114 8.36427C9.9114 8.37693 9.9114 8.39593 9.9114 8.42127L9.9494 8.49727C9.9494 8.50993 9.9494 8.5226 9.9494 8.53527C9.9494 8.54793 9.9494 8.5606 9.9494 8.57327C9.97473 8.7126 9.99373 8.83293 10.0064 8.93427C10.0191 9.25093 9.93673 9.49793 9.7594 9.67527C9.58207 9.83993 9.36673 9.9286 9.1134 9.94127C8.87273 9.95393 8.65107 9.8906 8.4484 9.75127C8.24573 9.61193 8.13173 9.39027 8.1064 9.08627C8.1064 9.0356 8.10007 8.97227 8.0874 8.89627C8.0494 8.71893 8.0304 8.62393 8.0304 8.61127C7.97973 8.26927 7.9924 7.96527 8.0684 7.69927C8.23307 7.0786 8.54973 6.55293 9.0184 6.12227C9.4744 5.70427 9.97473 5.41293 10.5194 5.24827C11.0641 5.07093 11.6277 4.9886 12.2104 5.00127C12.7931 5.00127 13.3567 5.08993 13.9014 5.26727C14.4461 5.4446 14.9464 5.74227 15.4024 6.16027C15.8711 6.57827 16.2004 7.0786 16.3904 7.66127C16.7324 8.7886 16.3651 9.92227 15.2884 11.0623C15.1997 11.1763 15.0921 11.2966 14.9654 11.4233L14.5474 11.8033C14.3954 11.9426 14.2814 12.0503 14.2054 12.1263C13.8634 12.4683 13.6291 12.7469 13.5024 12.9623C13.3377 13.2663 13.2364 13.5069 13.1984 13.6843C13.1857 13.7603 13.1731 13.8806 13.1604 14.0453C13.1224 14.3999 13.1034 14.6153 13.1034 14.6913ZM12.9134 17.0093C13.1414 17.2246 13.2427 17.4526 13.2174 17.6933C13.1921 17.9339 13.0907 18.1493 12.9134 18.3393C12.7361 18.5166 12.5207 18.6179 12.2674 18.6433C12.0267 18.6686 11.7987 18.5673 11.5834 18.3393C11.3554 18.1239 11.2541 17.8959 11.2794 17.6553C11.3047 17.4019 11.4061 17.1866 11.5834 17.0093C11.7734 16.8319 11.9887 16.7306 12.2294 16.7053C12.4701 16.6799 12.6981 16.7813 12.9134 17.0093Z"
          fill="white"/>
      </svg>
      ,
      path: "/series",
    },
    {
      name: t("Notifications"),
      icon: <svg className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img"
                 viewBox="0 0 24 24" width="24">
        <path
          d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
      </svg>,
      activeIcon: <svg className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24"
                       role="img" viewBox="0 0 24 24" width="24">
        <path
          d="M17.075 1.987a5.852 5.852 0 0 0-5.07 2.66l-.008.012-.01-.014a5.878 5.878 0 0 0-5.062-2.658A6.719 6.719 0 0 0 .5 8.952c0 3.514 2.581 5.757 5.077 7.927.302.262.607.527.91.797l1.089.973c2.112 1.89 3.149 2.813 3.642 3.133a1.438 1.438 0 0 0 1.564 0c.472-.306 1.334-1.07 3.755-3.234l.978-.874c.314-.28.631-.555.945-.827 2.478-2.15 5.04-4.372 5.04-7.895a6.719 6.719 0 0 0-6.425-6.965Z"></path>
      </svg>,
      path: "/notifications",
    },
    {
      name: t("Create"),
      icon: <svg className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img"
                 viewBox="0 0 24 24" width="24">
        <path
          d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z"
          fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line>
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line>
      </svg>,
      activeIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 12V15.45C2 18.299 2.698 19.455 3.606 20.394C4.546 21.303 5.704 22.002 8.552 22.002H15.448C18.296 22.002 19.454 21.302 20.394 20.394C21.302 19.455 22 18.3 22 15.45V8.552C22 5.703 21.302 4.546 20.394 3.607C19.454 2.7 18.296 2 15.448 2H8.552C5.704 2 4.546 2.699 3.606 3.607C2.698 4.547 2 5.703 2 8.552V12Z"
          fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.54492 12.001H17.4549" stroke="white" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round"/>
        <path d="M12.0029 6.54504V17.455" stroke="white" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round"/>
      </svg>,
      path: "/create",
    },
  ]

  return (
    <aside
      className={"fixed left-0 top-0 w-[245px] h-screen border-[#DBDBDB] border-r px-3 pt-2 pb-4 z-10 bg-background"}>
      <div>
        <div className={"mb-auto px-3 pb-4 h-[92px] pt-[25px]"}>
          <Link href={"/"} prefetch>
            <Image width={132} height={32} src={"/logo.svg"} alt={"LOGO"}/>
          </Link>
        </div>
        <div className={"flex flex-col"}>
          {
            menu.map((item, index) => {
              return (
                <Link
                  prefetch
                  href={item.path}
                  key={index}
                  className={clsx([
                    "w-full h-12 hover:bg-black/5 cursor-pointer rounded-lg p-3 gap-4 flex items-center group my-1",
                    pathname.startsWith(item.path) && "font-bold",
                  ])}
                >
                  {pathname.startsWith(item.path) ? item.activeIcon : item.icon}
                  <div className={"text-[18px] leading-5"}>
                    {item.name}
                  </div>
                </Link>
              )
            })
          }
          <form action={async () => {
            if (connectLink) {
              window.open(connectLink, "_blank");
              return;
            }
            setStatus("loading");
            const {url} = await createLoginLink(connectedAccountId);
            setStatus("idle");
            setConnectLink(url);
            window.open(url, "_blank");
          }}>
            <button
              disabled={status === "loading"}
              type={"submit"}
              className={clsx([
                "w-full h-12 hover:bg-black/5 cursor-pointer rounded-lg p-3 gap-4 flex items-center group my-1",
              ])}
            >
              <svg className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24"
                   role="img" viewBox="0 0 24 24" width="24">
                <path
                  d="M8 12a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1Zm8-3a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1Zm-4-2a1 1 0 0 0-1 1v8a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Z"></path>
                <path
                  d="M18.44 1H5.567a4.565 4.565 0 0 0-4.56 4.56v12.873a4.565 4.565 0 0 0 4.56 4.56H18.44a4.565 4.565 0 0 0 4.56-4.56V5.56A4.565 4.565 0 0 0 18.44 1ZM21 18.433a2.563 2.563 0 0 1-2.56 2.56H5.567a2.563 2.563 0 0 1-2.56-2.56V5.56A2.563 2.563 0 0 1 5.568 3H18.44A2.563 2.563 0 0 1 21 5.56v12.873Z"></path>
              </svg>
              <div className={"text-[18px] leading-5"}>
                {status === "idle" && "Dashboard"}
                {status === "loading" && "Connecting..."}
                {status === "error" && "Error"}
              </div>
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}

export default SideBar