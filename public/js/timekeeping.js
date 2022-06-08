let btnstart = document.getElementById('btn-start');
let btnend = document.getElementById('btn-end');
let btn_annual_leave = document.getElementById('btn-annual-leave');

btnstart.onclick = function() {
    document.getElementsByClassName('annual-leave')[0].style.display = 'none'; 
    document.getElementsByClassName('end-working')[0].style.display = 'none'; 
    document.getElementsByClassName('start-working')[0].style.display = 'block';  
    document.getElementsByClassName('time-record-list')[0].style.display = 'none';
};

btnend.onclick = function() {
    document.getElementsByClassName('annual-leave')[0].style.display = 'none'; 
    document.getElementsByClassName('start-working')[0].style.display = 'none'; 
    document.getElementsByClassName('end-working')[0].style.display = 'block';
    document.getElementsByClassName('time-record-list')[0].style.display = 'block';   
};

btn_annual_leave.onclick = function() {
    document.getElementsByClassName('start-working')[0].style.display = 'none'; 
    document.getElementsByClassName('end-working')[0].style.display = 'none'; 
    document.getElementsByClassName('annual-leave')[0].style.display = 'block';  
    document.getElementsByClassName('time-record-list')[0].style.display = 'none';
};

let hoursAmount = document.getElementById('hoursAmount');
let annualLeaveRemaning = document.getElementById('annual-leave-remaining');

hoursAmount.onchange = function(event) {
    document.getElementById('dayWorkingAmount').innerHTML = "= " + hoursAmount.value/8 + " Working Day";
    if(annualLeaveRemaning.value < hoursAmount.value/8) {
        alert('Annual Leave\'s not enough!')
    }
}


let dateOff = document.getElementById('dateOff');

let anRecord = document.getElementById('annual-leave-record').value;

document.getElementById('btnsubmitannualleave').onclick = function(event) {

    let checkDateOff = anRecord.includes(dateOff.value);

    if (annualLeaveRemaning.value == 0) {
        alert('Annual Leave\'s over!');
        event.preventDefault();
    } else if (annualLeaveRemaning.value < hoursAmount.value/8) {
        alert('Annual Leave\'s not enough!');
        event.preventDefault();
    } else if(checkDateOff == true && dateOff.value != '') {
        alert('Date was subscribed before!');
        event.preventDefault();
    } 
}