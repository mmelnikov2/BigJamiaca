// ---------- DATA (from current site, Nov 2026) ----------
window.DEFAULT_CONTENT={};
// Today's sailing status (set from the admin page). level: go | watch | cancelled
DEFAULT_CONTENT.status={level:"go",text:"All trips sailing as scheduled."};
DEFAULT_CONTENT.trips=[
 {id:"pm-seabass",name:"Afternoon Sea Bass",cat:"day",hrs:5,time:"4:00 pm – 9:00 pm",season:"May–Jun, Fri–Sun",species:["Sea bass"],prices:{Adult:75,Senior:70,Military:70,"Child (12 & under)":50},rod:10,bunk:0,c:["#1f6f8b","#0b2340"],note:"4-ticket deal: $280 incl. 4 rental rods. Limit 10 sea bass."},
 {id:"daily",name:"Daily Bluefish & Mixed Bag",cat:"day",hrs:7,time:"7:30 am – 2:30 pm",season:"Jun–Sep, daily",species:["Bluefish","Bonito","Fluke","Sea bass"],prices:{Adult:95,Senior:85,Military:90,"Child (under 13)":60},rod:10,bunk:0,c:["#2a8fa8","#12345c"],note:"Groups of 4+ adults: $85 each."},
 {id:"fullday",name:"Full Day Stripers & Blackfish",cat:"day",hrs:8,time:"Seasonal",season:"Fall–Winter",species:["Striped bass","Blackfish","Ling","Cod"],prices:{Adult:95,Senior:85,Military:85,"Child (12 & under)":60},rod:10,bunk:0,c:["#3c6e8f","#0b2340"],note:"Groups of 4+: $10 off each."},
 {id:"sb-special",name:"Sea Bass Special",cat:"day",hrs:8.5,time:"7:00 am – 3:30 pm",season:"Fall",species:["Sea bass"],prices:{Adult:99,Senior:89,Child:60},rod:10,bunk:0,c:["#1f6f8b","#12345c"],note:"Groups of 4+: $10 off each."},
 {id:"marathon",name:"Sea Bass Marathon",cat:"day",hrs:10,time:"6:00 am – 4:00 pm",season:"Fall",species:["Sea bass"],prices:{Adult:105,Senior:95,Child:65},rod:10,bunk:0,c:["#245c7a","#0b2340"],note:"Limited capacity.",hot:true},
 {id:"midrange",bookUrl:"12hourmid-rangeseabass",name:"12-Hour Mid-Range Wrecks",cat:"day",hrs:12,time:"4:00 am – 4:00 pm",season:"Nov–Dec",species:["Sea bass"],prices:{Adult:130},rod:10,bunk:15,c:["#ff6a1a","#12345c"],note:"Trips board 1 hour prior.",hot:true},
 {id:"overnight-sb",bookUrl:"18houroffshorewreckseabasstrips",name:"18-Hour Offshore Wreck Sea Bass",cat:"offshore",hrs:18,time:"10:00 pm – 4:00 pm",season:"Fall–Winter",species:["Giant sea bass"],prices:{Adult:230},rod:10,bunk:15,c:["#0b2340","#ff6a1a"],note:"Wrecks 50–80 miles out. Heated cabin and rails."},
 {id:"tuna22",name:"22-Hour Canyon Tuna",cat:"offshore",hrs:22,time:"7:00 pm – next day",season:"Late summer–Fall",species:["Tuna"],prices:{Adult:390},rod:30,bunk:15,c:["#0b2340","#1f6f8b"],note:"Braid for jigging only."},
 {id:"tuna24",bookUrl:"24houroffshoretunatrips",name:"24-Hour Offshore Tuna",cat:"offshore",hrs:24,time:"7:00 pm – 7:00 pm",season:"Late summer–Fall",species:["Tuna","Mahi"],prices:{Adult:400},rod:30,bunk:15,c:["#0b2340","#2a8fa8"],note:"Mahi rod $15."},
 {id:"tile25",bookUrl:"25hourtilefishtrip",name:"25-Hour Tilefish",cat:"offshore",hrs:25,time:"10:00 pm – 11:00 pm next day",season:"Spring–Summer",species:["Tilefish"],prices:{Adult:410},rod:40,bunk:15,c:["#3a2a6a","#0b2340"],note:"Squid included."},
 {id:"tile15",bookUrl:"15daytilefishtrips",name:"1.5-Day Tilefish",cat:"offshore",hrs:31,time:"10:00 pm – 5:00 am day 2",season:"Late spring–Summer",species:["Tilefish"],prices:{Adult:440},rod:40,bunk:15,c:["#3a2a6a","#12345c"],note:"12–15 hours of fishing."},
 {id:"tuna31",bookUrl:"31hourtunamahitrips",name:"31-Hour Tuna & Mahi",cat:"offshore",hrs:31,time:"7:00 am – 2:00 pm next day",season:"Late summer–Fall",species:["Tuna","Mahi"],prices:{Adult:450},rod:30,bunk:15,c:["#0b2340","#ff6a1a"],note:"12–15 hours of fishing."},
 {id:"thanks",bookUrl:"65hourthanksgivingdaystripedbasstrip",name:"Thanksgiving Day Stripers",cat:"special",hrs:6.5,time:"Thanksgiving morning",season:"Thanksgiving",species:["Striped bass"],prices:{Adult:95},rod:10,bunk:0,c:["#b54708","#0b2340"],note:"Holiday special.",hot:true},
 {id:"bonito",bookUrl:"8hourspecialbonitoalbacoremahi-mahitrips",name:"Bonito & Albacore Special",cat:"special",hrs:8.5,time:"6:30 am",season:"Late summer",species:["Bonito","Albacore","Mahi"],prices:{Adult:120},rod:15,bunk:0,c:["#1f8a4c","#0b2340"],note:"Price placeholder, confirm."},
 {id:"j4",name:"July 4th Fireworks Cruise",cat:"special",hrs:3.25,time:"7:30 pm – 10:45 pm",season:"July 4",species:["Fireworks"],prices:{Adult:75,"Child (under 12)":55},rod:0,bunk:0,c:["#7a1f3d","#0b2340"],note:"Long Branch fireworks."}
];
DEFAULT_CONTENT.sailings=[ // demo calendar (admin edits this)
 {t:"midrange",d:"2026-11-16",left:6},{t:"midrange",d:"2026-11-19",left:14},{t:"overnight-sb",d:"2026-11-17",left:22},
 {t:"overnight-sb",d:"2026-11-19",left:9},{t:"overnight-sb",d:"2026-11-20",left:31},{t:"overnight-sb",d:"2026-11-21",left:0,status:"soldout"},
 {t:"thanks",d:"2026-11-26",left:40},{t:"marathon",d:"2026-11-22",left:18},{t:"marathon",d:"2026-11-29",left:35}
];
// Demo: fill future months so the calendar has something to show (replace with real schedule)
(function(){const add=(t,from,to,days,left)=>{for(let d=new Date(from+"T12:00:00");d<=new Date(to+"T12:00:00");d.setDate(d.getDate()+1)){if(days.includes(d.getDay()))DEFAULT_CONTENT.sailings.push({t,d:d.toISOString().slice(0,10),left:left+((d.getDate()*7)%23)})}};
 add("overnight-sb","2026-11-24","2027-02-27",[2,4,5,6],8);   // Tue/Thu/Fri/Sat nights
 add("marathon","2026-12-06","2026-12-27",[0],12);           // Sundays in December
 add("midrange","2026-12-01","2026-12-31",[1,3],10);         // Mon/Wed in December
 add("fullday","2027-01-03","2027-03-28",[0],20);            // Sundays Jan–Mar
 add("sb-special","2027-03-01","2027-03-31",[3,6],15);       // Wed/Sat in March
})();
DEFAULT_CONTENT.reports=[
 {d:"2026-09-09",t:"New Bonito, Albacore & Bluefish Special, Friday 6:30 AM",tag:"Bonito",x:"Bonito and albacore showed up on the inshore lumps. Adding a special Friday trip, limited spots.",s:{}},
 {d:"2026-09-01",t:"Schedule & Report: Tuna Trip Thursday 7 AM",tag:"Tuna",x:"Good tuna bite at the canyon last trip. Few spots left for Thursday.",s:{"Tuna":"12"}},
 {d:"2026-08-11",t:"Bluefishing 7:30 AM Every Day",tag:"Bluefish",x:"Steady blues all morning, a few bonito mixed in.",s:{"High hook":"31","Pool":"9 lb"}},
 {d:"2026-07-30",t:"Bluefish, Bonito, Tuna, Tilefish & Night Blues",tag:"Mixed",x:"Something for everyone this week. See schedule below.",s:{}},
 {d:"2026-07-23",t:"Big Blues Moved In, up to 10 lbs!",tag:"Bluefish",x:"Everyone limited. Big gator blues on the jig.",s:{"Biggest":"10 lb"}}
];
DEFAULT_CONTENT.charters=[
 ["Weekend day (Sat–Sun)","Apr–Nov · 6–7 hrs · from 6:30 am",8200,75,85],
 ["Weekday day (Mon–Thu)","Apr–Sep 5 · 6–7 hrs · from 6:30 am",4000,40,80],
 ["4-hr afternoon/evening","Sun–Thu · 3:30 pm or later",2700,40,55],
 ["5-hr afternoon/evening","Sun–Thu · 3:30 pm or later",3000,40,60],
 ["6-hr afternoon/evening","Sun–Thu · 3:30 pm or later",3300,40,70],
 ["Friday night 6-hr","Apr–Sep 5",3600,40,75],
 ["Saturday night","7:30 pm – 1:30 am",5600,60,75],
 ["Weekday canyon tuna","Sun–Thu 6 pm · 22 hrs",10200,26,350],
 ["Weekend canyon tuna","Fri or Sat 6 pm",10900,28,370],
 ["30-hour trip","Mon/Tue/Thu 7 am",12600,28,420]
];
DEFAULT_CONTENT.photos=[{cap:"Limits of sea bass on the wrecks",d:"2026-11-09"},{cap:"Gator blues up to 10 lb",d:"2026-07-23"},{cap:"Canyon yellowfin",d:"2026-09-01"},{cap:"Golden tilefish",d:"2026-06-14"},{cap:"Bonito on the jig",d:"2026-09-09"},{cap:"Sunrise at Manasquan Inlet",d:"2026-08-02"}];
