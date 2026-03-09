import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          greeting: "Welcome to MyChurch",
          donate: "Giving",
          NameChurch: "BLESSING STREAM CHURCH",
          backtotop: "Back to top ",
          map: {
            Bangkok_church: "Blessing stream Church Bangkok",
            Chiangmai_church: "Blessing stream Church Chiang Mai",
            Phayao_church: "Blessing stream Church Phayao",
            Chiangrai_church: "Blessing stream Church Chiang Rai",
            Thanyaburi_church: "Blessing stream Church Thanyaburi",
            NongBuaLamPhu_church: "Blessing stream Church Nong Bua Lamphu",
            outreach: "กิจกรรมเพื่อสังคม",
            outreach_desc: "แบ่งปันรักสู่ชุมชน ณ สวนลุมพินี",
            main_desc: "...",
            view_location: "View Location",
            reset_view: "Back to Overview",
            subtitle: "Find a church location near you",
            places: "Churches",
            select_location: "Select Church Location",
          },
          hero: {
            welcome_tag: "Welcome to",
            title: "BLESSING STREAM CHURCH",
            button: "Locations",
            subtitle: "Church for Everyone",
          },
          section: {
            service: "Service Times",
            location: "Locations",
            get_direction: "Get Directions",
            reset_map: "Back to Overview", // 👈 ปุ่มวาร์ปกลับ
          },
          vision: {
            loving_title: "Sharing the Gospel",
            growing_title: "W",
            weekly_title: "Worship",
          },
          dashboard: {
            hearers: "Hearers",
            decisions: "Decisions",
            baptized: "Baptized",
            targetAreas: "Target Areas",
            disciples: "Disciples",
            houseChurches: "Hom Churches",
          },
          menu: {
            home: "Home",
            about: "About Us",
            sermons: "Sermons",
            mission: "Mission",
            contact: "Contact",
            activity: "Activities",
          },
          home: {
            viewFullReport: "View Full Report",
            missionFeed: "Chruch Locations ",
            expansionUpdates: "6 Churches across Thailand",
          },
          e: {
            topic:"Event Overview",
            header: "All",
            header2: "Events",
            all_events: "All Events",
            description: "Not happening right now. Check back later ",
            search_placeholder: "Search events...",
          },          
          footer: {
            church_name: "Blessing Stream Church",
            description:
              "Wait for full description...",
            service_title: "Service Times",
            sunday_service: "Sunday Service",
            contact_title: "Contact Us",
            address:
              "On Concrete Road",
            copyright: "© 2025 Blessing Stream Church. All rights reserved.",
            privacy: "Privacy Policy",
            terms: "Terms of Service",
          },
        },
      },
      th: {
        translation: {
          greeting: "MyChurch",
          donate: "ถวาย",
          NameChurch: "คริสตจักรธารพระพร",
          backtotop: "กลับสู่ด้านบน",
          map: {
            Bangkok_church: "คริสตจักรธารพระพร กรุงเทพฯ",
            Chiangmai_church: "คริสตจักรธารพระพร เชียงใหม่",
            Chiangrai_church: "คริสตจักรธารพระพร เชียงราย",
            Phayao_church: "คริสตจักรธารพระพร พะเยา",
            Thanyaburi_church: "คริสตจักรธารพระพร ธัญบุรี",
            NongBuaLamPhu_church: "คริสตจักรธารพระพร หนองบัวลําภู",
            outreach_desc: "แบ่งปันรักสู่ชุมชน ณ สวนลุมพินี",
            main_desc: "...",
            view_location: "ดูตำแหน่ง",
            reset_view: "กลับสู่ภาพรวม",
            subtitle: "ค้นหาตำแหน่งคริสตจักรใกล้คุณ",
            places: "คริสตจักร",
            select_location: "เลือกดูตำแหน่งคริสตจักร",
          },

          section: {
            service: "รอบนมัสการ",
            location: "สถานที่",
            get_direction: "นำทางไปที่นี่",
            reset_map: "กลับสู่ภาพรวม", 
          },
          dashboard: {
            hearers: "ผู้ได้ยิน",
            decisions: "ตัดสินใจเชื่อ",
            baptized: "ผู้บัพติศมา",
            targetAreas: "พื้นที่เป้าหมาย",
            disciples: "สมาชิก",
            houseChurches: "คริสตจักรบ้าน",
          },
          hero: {
            welcome_tag: "ยินดีต้อนรับสู่",
            title: "คริสตจักรธารพระพร",
            button: "สถานที่ตั้ง",
            subtitle: "คริสตจักรเพื่อทุกคน",
          },
          vision: {
            loving_title: "ประกาศข่าวประเสริฐ",
            growing_title: "เติบโตในพระเจ้า",
            weekly_title: "นมัสการ",
          },
          menu: {
            home: "หน้าแรก",
            about: "เกี่ยวกับเรา",
            sermons: "คำเทศนา",
            mission: "พันธกิจ",
            contact: "ติดต่อเรา",
            activity: "กิจกรรม",
          },
          home: {
            viewFullReport: "แสดงแบบเต็ม",
            missionFeed: "ตำแหน่งคริสตจักร",   
            expansionUpdates: "คริสตจักรทั้งหมด 6 แห่งในประเทศไทย",
          },
          e: {
            topic:"ภาพรวมกิจกรรม",
            header: "กิจกรรม",
            header2: "ทั้งหมด",
            all_events: "กิจกรรมทั้งหมด",
            description: "ยังไม่มีอะไรในขณะนี้ เดี๋ยวมาเขียน",
            search_placeholder: "ค้นหากิจกรรม...",
          },
          footer: {
            church_name: "คริสตจักรธารพระพร",
            description:
              "เดี๋ยวมาเขียน",
            service_title: "รอบนมัสการ",
            sunday_service: "วันอาทิตย์",
            contact_title: "ติดต่อเรา",
            address: "ถนน คอนกรีต",
            copyright: "© 2025 Blessing Stream Church. สงวนลิขสิทธิ์",
            privacy: "นโยบายความเป็นส่วนตัว",
            terms: "ข้อกำหนดการใช้งาน",
          },
        },
      },
    },
  });

export default i18n;
