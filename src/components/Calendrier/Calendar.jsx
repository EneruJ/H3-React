import {useState, useEffect} from "react";
import * as React from "react";
import moment from 'moment';
import "./styles.css";
import "../Modal/styles.css";
import Modal from "../Modal/Modal";
moment.updateLocale('fr', {
    week: {
      dow: 1,
    },
  });
const Calendar = () => {
    const [show, setShow] = useState(false);
    const [calendar, setCalendar] = useState([])
    const [value, setValue] = useState(moment());
    const [rdv, setRDV] = useState([]);
    const debutMois = value.clone().startOf('month').startOf('week');
    const finMois = value.clone().endOf('month').endOf('week');
    useEffect(() => {
        const jour = debutMois.clone().subtract(1, "day");
        const a = []
        while(jour.isBefore(finMois, "day")){
            a.push(
                Array(7).fill(0).map(() => jour.add(1, "day").clone())
            )
        }
        setCalendar(a)
    }, [value])
    useEffect(() => {
        const items = { ...localStorage };
        Object.values({items}).map((value, index) => {
            setRDV(value);
        })

    }, [rdv])
    function isSelected(jour){
        return value.isSame(jour, "day");
    }
    function beforeToday(jour){
        return jour.isBefore(new Date(), "day");
    }
    function isToday(jour){
        return jour.isSame(new Date(), "day")
    }
    function dayStyles(jour){
        if(beforeToday(jour)) return "before"
        if(isSelected(jour)) return "selected"
        if(isToday(jour)) return "today"
        return ""
    }

    function currMonth(){
        return value.format("MMMM")
    }
    function currYear(){
        return value.format("YYYY")
    }
    function prevMonth(){
        return value.clone().subtract(1, "month")
    }
    function nextMonth(){
        return value.clone().add(1, "month")
    }
    function newRDV(){
        localStorage.setItem("rdv" + document.getElementById("titre").value, JSON.stringify({key: "rdv" + document.getElementById("titre").value, titre: document.getElementById("titre").value, comm: document.getElementById("comm").value, date: {value}}) )
    }

    return ( 
    <>
    <Modal title="Prise de rendez-vous" onClose={() => {
newRDV()
setShow(false)
    } } show={show}>
        <form action="#">
         <input type = "text" id="titre" name = "titre" placeholder="Titre" />
         <br /><br />
         <input type = "text" id="comm" name = "commentaire" placeholder="Commentaire"/>
         <br /><br />
         Jour du rendez-vous : {value.format("DD/MM/YYYY")}
        </form>
    </Modal>
    <h1 className="titre">Projet React Calendrier + Formulaire</h1>  
    <div className="calendar"> 
        <div className="header">
            <div className="previous" onClick={() => setValue(prevMonth())}>{String.fromCharCode(171)}</div>
            <div className="current">{currMonth()} {currYear()}</div>
            <div className="next" onClick={() => setValue(nextMonth())}>{String.fromCharCode(187)}</div>
        </div>
        <div className="body">
            <div className="day-names">
                {
                    ["m", "t", "w", "t", "f", "s", "s"].map((d) => <div className="week">{d}</div>)
                }
            </div>
        {calendar.map((semaine) => (
            <div>
                {semaine.map((jour) => (
                    <div className="day" onClick={() => {
                        setValue(jour)
                        setShow(true)
                        }
                    }>
                        <div className={dayStyles(jour)}>
                        {jour.format("D").toString()}
                        </div>
                    </div>
                ))}
            </div>
        ))} 
        </div>
    </div>
    <div className="liste-rdv">   
        {Object.values(rdv).map(value => {
           const data = JSON.parse(value);
           const date = new Date(data["date"].value)
           return (
            <>
            <h2>{data["titre"]} - {date.toLocaleDateString("fr")}</h2>
            <p>{data["comm"]}</p>
            </>
           )
        })}
    </div>
    </>
    );
}
 
export default Calendar;