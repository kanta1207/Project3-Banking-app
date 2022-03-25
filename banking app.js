const config = {
    initialForm: document.getElementById("initial-form"),
    bankPage: document.getElementById("bankPage"),
    sidePage: document.getElementById("sidePage")
};

console.log(config.initialForm);

class BankAccont {
    constructor(firstName,lastName,email,accountNumber,type,money){
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.type = type;
        this.accountNumber = accountNumber;
        this.money = money;
    }
    getFullName(){
        return this.firstName + " " + this.lastName;
    }

    withdrawBalance(total){
        total = parseInt(total);
        this.money -= total;
    }

    depositBalance(total){
        total = parseInt(total);
        this.money += total; 
    }
    simulateDatePassage(days){
        let annualInterest  = 0.2;
        let profit = (this.money * annualInterest) / 365 * days;
        this.money += profit;
    }
    
}

function getRandomInterger(min,max){
    return Math.floor(Math.random() * (max - min) - min);
}

function initializeUserAccount(){
    const form = document.getElementById("bank-form");
// なぜquerySelectorAll?getElementByNameとか、IDそれぞれつけといてGetelementyIdはダメなのか
    let firstName = form.querySelectorAll(`input[name="First name"]`)[0].value;
    let lastName = form.querySelectorAll(`input[name="Last name"]`)[0].value;
    let email = form.querySelectorAll(`input[name="Email"]`)[0].value;
    let type = form.querySelectorAll(`input[name="userAccountType"]:checked`)[0].value;
    let accountNumber = getRandomInterger(1,Math.pow(10,8));
    let initialDeposit = parseInt(form.querySelectorAll(`input[name="First deposit"]`)[0].value)
    
    const userAccount = new BankAccont(firstName,lastName,email,accountNumber,type,initialDeposit);
    return userAccount;
};

function mainBankPageController(userAccount,curEle){
    resetPage(curEle);
    removeDisplayNone(config.bankPage);
    config.bankPage.append(mainBankPage(userAccount))
}

function mainBankPage(userAccount){
    let infoCon = document.createElement(`div`);
    infoCon.classList.add(`text-right`,`pt-2`);
    infoCon.innerHTML = 
    `<p>Your Name: ${userAccount.getFullName()}</p>
    <p>Your Bank ID: ${userAccount.accountNumber}</p>`
    
    let BalanceCon = document.createElement(`div`);
    BalanceCon.classList.add(`col-12`,`py-1`,`py-md-3`);
    BalanceCon.innerHTML = 
    `<div class="bg-danger d-flex py-1">
     <h4 class="text-left col-8">Available Balance</h4>
     <h4 class="text-right col-4">$${userAccount.money}</h4>
    </div>`

    let menuCon = document.createElement(`div`);
    menuCon.classList.add(`d-flex`,`justify-content-center`,`flex-wrap`,`pb-2`);
    menuCon.innerHTML = 
    `<div class="col-lg-4 co-12 py-1 py-md-3 px-md-1">
    <div class="bg-blue hover p-3" id="withdrawalBtn">
        <!-- ここではホバーは青ボックスdivに直接 -->
    <h5>WITHDRAWAL</h5>
    <i class="fa-solid fa-wallet fa-3x"></i>
    </div>
</div>
<div class="col-lg-4 col-12 py-md-3 px-md-1 py-1 hover">
    <!-- こっちではホバーは青ボックスの親に、結果は同じのよう？？ -->
    <div class="bg-blue p-3" id="depositBtn">
    <h5>DEPOSIT</h5>
    <i class="fa-solid fa-coins fa-3x"></i>
    </div>
</div>
<div class="col-lg-4 col-12 py-md-3 px-md-1 hover py-1">
    <div class="bg-blue p-3" id="backBtn">
        <h5>COME BACK LATER</h5>
        <i class="fa-solid fa-house-chimney fa-3x"></i>
    </div>
</div>`
menuCon.querySelectorAll(`#withdrawalBtn`)[0].addEventListener(`click`,function(){withdrawalController(userAccount)});
menuCon.querySelectorAll(`#depositBtn`)[0].addEventListener(`click`,function(){depositController(userAccount)});
menuCon.querySelectorAll(`#backBtn`)[0].addEventListener(`click`,function(){comeBackLaterController(userAccount)});
let container = document.createElement(`div`);
container.append(infoCon,BalanceCon,menuCon);
return container;
};

function withdrawalController(userAccount){
    resetPage(config.bankPage);
    removeDisplayNone(config.sidePage);
    config.sidePage.append(withdrawalPage(userAccount));
}

function withdrawalPage(userAccount){
    let container = document.createElement(`div`);
    container.id = `withdrawal`
    container.append(billInputSelector(`withdrawal`));
    container.append(backNextbtn(`back`,`next`));
    let backBtn = container.querySelectorAll(`#backBtn`)[0];
    let nextBtn = container.querySelectorAll(`#nextBtn`)[0];
    backBtn.addEventListener(`click`,function(){mainBankPageController(userAccount,config.sidePage)})
    nextBtn.addEventListener(`click`,function(){withdrawalBillDialogController(userAccount)})
    return container;
}
function depositController(userAccount){
    resetPage(config.bankPage);
    removeDisplayNone(config.sidePage);
    config.sidePage.append(depositPage(userAccount));
}

function depositPage(userAccount){
    let container = document.createElement(`div`);
    container.id = `deposit`
    container.append(billInputSelector(`deposit`));
    container.append(backNextbtn(`back`,`next`));
    let backBtn = container.querySelectorAll(`#backBtn`)[0];
    let nextBtn = container.querySelectorAll(`#nextBtn`)[0];
    backBtn.addEventListener(`click`,function(){mainBankPageController(userAccount,config.sidePage)})
    nextBtn.addEventListener(`click`,function(){depositBillDialogController(userAccount)})
    return container;
}
function comeBackLaterController(userAccount){
    resetPage(config.bankPage);
    removeDisplayNone(config.sidePage);
    config.sidePage.append(comeBackLaterPage(userAccount));
}

function comeBackLaterPage(userAccount){
    let container = document.createElement(`div`);
    container.innerHTML = `<h2 class="pb-2">
        How many days will you be gone?
    </h2>
    <div class="">
        <input type="number" value="0" id="days" form-control form-control-sm text-right">
    </div>`;
    container.append(backNextbtn(`Back`,`Confirm`));
    let backBtn = container.querySelectorAll(`#backBtn`)[0];
    let nextBtn = container.querySelectorAll(`#nextBtn`)[0];
    let days = container.querySelectorAll(`#days`)[0].value;
    backBtn.addEventListener(`click`,function(){resetPage(config.sidePage);mainBankPageController(userAccount,config.sidePage)})
    nextBtn.addEventListener(`click`,function(){userAccount.simulateDatePassage(days);mainBankPageController(userAccount,config.sidePage);});
    return container;
}

function withdrawalBillDialogController(userAccount){
    displayNone(config.sidePage.querySelectorAll(`#withdrawal`)[0]);
    config.sidePage.append(withdrawalBillDialogPage(userAccount));
}
function withdrawalBillDialogPage(userAccount){
    let container = billDialog(userAccount,`withdrawal`);
    container.append(backNextbtn(`Go back`,`Confirm`));
    let total = container.querySelectorAll(`#total`)[0].innerHTML;
    console.log(total);
    let backBtn = container.querySelectorAll(`#backBtn`)[0];
    let nextBtn = container.querySelectorAll(`#nextBtn`)[0];
    backBtn.addEventListener(`click`,function(){resetPage(config.sidePage);withdrawalController(userAccount)})
    nextBtn.addEventListener(`click`,function(){userAccount.withdrawBalance(total);mainBankPageController(userAccount,config.sidePage);});
    return container;
}

function depositBillDialogController(userAccount){
    displayNone(config.sidePage.querySelectorAll(`#deposit`)[0]);
    config.sidePage.append(depositBillDialogPage(userAccount));
}

function depositBillDialogPage(userAccount){
    let container = billDialog(userAccount,`deposit`);
    container.append(backNextbtn(`Go back`,`Confirm`));
    let total = container.querySelectorAll(`#total`)[0].innerHTML;
    console.log(total);
    let backBtn = container.querySelectorAll(`#backBtn`)[0];
    let nextBtn = container.querySelectorAll(`#nextBtn`)[0];
    backBtn.addEventListener(`click`,function(){resetPage(config.sidePage);depositController(userAccount)})
    nextBtn.addEventListener(`click`,function(){userAccount.depositBalance(total);mainBankPageController(userAccount,config.sidePage);});
    return container;
}

function billInputSelector(title){
    let container = document.createElement("div");
    const topTitle = title[0].toUpperCase() + title.slice(1,title.length);
    container.innerHTML = 
    `<h2 class="pb-2">
        Please Enter The ${topTitle} Amount
    </h2>
    <div class="row form-group">
        <label for="${title}100" class="col-2 col-form-label col-form-label-sm">$100</label>
        <div class="col-10">
            <input type="number" value="0" id="${title}100" data-bill="100" class="bill-input form-control form-control-sm text-right">
        </div>
    </div>
    <div class="row form-group">
        <label for="${title}50" class="col-2 col-form-label col-form-label-sm">$50</label>
        <div class="col-10">
            <input type="number" value="0" id="${title}50" data-bill="50" class="bill-input form-control form-control-sm text-right">
        </div>
    </div>
    <div class="row form-group">
        <label for="${title}20" class="col-2 col-form-label col-form-label-sm">$20</label>
        <div class="col-10">
            <input type="number" value="0" id="${title}20" data-bill="20" class="bill-input form-control form-control-sm text-right">
        </div>
    </div>
    <div class="row form-group">
        <label for="${title}10" class="col-2 col-form-label col-form-label-sm">$10</label>
        <div class="col-10">
            <input type="number" value="0" id="${title}10" data-bill="10" class="bill-input form-control form-control-sm text-right">
        </div>
    </div>
    <div class="row form-group">
        <label for="${title}5" class="col-2 col-form-label col-form-label-sm">$5</label>
        <div class="col-10">
            <input type="number" value="0" id="moneyWithdraw5" data-bill="5" class="bill-input form-control form-control-sm text-right">
        </div>
    </div>
    <div class="row form-group">
        <label for="${title}1" class="col-2 col-form-label col-form-label-sm">$1</label>
        <div class="col-10">
            <input type="number" value="0" id="${title}1" data-bill="1" class="bill-input form-control form-control-sm text-right">
        </div>
    </div>
    <div class="money-box pt-3">
        <!-- デフォルト？で謎の下パディングがかかってて、ptするとちょうどど真ん中になる、なぜじゃ -->
        <p>$<span id="summation">0</span></p>
    </div>`
    const billInputList = container.querySelectorAll(`.bill-input`);
    let summation = container.querySelectorAll(`#summation`)[0];
    for(let i = 0; i < billInputList.length; i++){
        billInputList[i].addEventListener(`change`,function(){summation.innerHTML = billSummation(billInputList,`data-bill`);});
    };
    return container;
}

function billDialog(userAccount,title){
    let billInputPage = config.sidePage.querySelectorAll(`#${title}`)[0];
    let billInputList = billInputPage.querySelectorAll(`.bill-input`);
    console.log(billInputList)
    let billInputSummation = parseInt(billInputPage.querySelectorAll(`#summation`)[0].innerHTML);
    let container = document.createElement(`div`);
    let resultDiv = document.createElement(`div`);
    resultDiv.classList.add(`col-12`,`pb-3`,`pt-1`,`py-md-3`);
    if(title === `withdrawal`){
    container.innerHTML = 
    `<h2 class="p-2">The money you are going to take is ...</h2>
        <div class="d-flex justify-content-center">
        <div class="calculate-box p-1 mb-3 text-right col-8 rem1p3">
        </div>
        </div>`
    resultDiv.innerHTML = 
        `<div class="bg-danger d-flex py-1 text-white">
            <h4 class="text-left col-8">Total to be withdrawn:</h4>
            <h4 class="text-right col-4">$<span id="total">${calculateWithdrawAmount(billInputSummation,userAccount.money)}</span></h4>
        </div>`
    }
    if(title === `deposit`){
        container.innerHTML = 
        `<h2 class="p-2">The money you are going to deposit is ...</h2>
            <div class="d-flex justify-content-center">
            <div class="calculate-box p-1 mb-3 text-right col-8 rem1p3">
            </div>
            </div>`
        resultDiv.innerHTML = 
            `<div class="bg-danger d-flex py-1 text-white">
                <h4 class="text-left col-8">Total to be deposited:</h4>
                <h4 class="text-right col-4">$<span id="total">${billInputSummation}</span></h4>
            </div>`
        }
    let calculateBox = container.querySelectorAll(`.calculate-box`)[0];
    for(let i = 0; i < billInputList.length; i++){
        if(billInputList[i].value == 0){
            continue;
        }
        else{//0じゃなかったらって言ってんのにこれがきいてねんだよなあ
            console.log(billInputList[i].value);
            let curEle = document.createElement(`div`);
            curEle.classList.add(`calculate-box`,`pr-2`,`pt-2`,`m-1`);
            curEle.innerHTML = `<p>${billInputList[i].getAttribute(`data-bill`)} x $${billInputList[i].value}</p>`
            calculateBox.append(curEle);
        } 
    }
    let summationDiv = document.createElement(`div`);
    summationDiv.classList.add(`text-right`)
    summationDiv.innerHTML = `<p>total: $${billInputSummation}</p>`
    calculateBox.append(summationDiv);
    container.append(resultDiv);
    return container
}

function backNextbtn(backString,nextString){
    let btnContainer = document.createElement(`div`);
    btnContainer.classList.add(`d-flex`,`justify-content-between`);
    btnContainer.innerHTML = 
    `<div class="col">
        <button type="button" id="backBtn" class="btn btn-outline-primary col-12">${backString}</button>
    </div>
    <div class="col">
        <button type="button" id="nextBtn" class="btn btn-primary col-12">${nextString}</button>
    </div>`
    return btnContainer
}
function billSummation(inputElementNodeList,attribute){
    let summation = 0;
    for(let i = 0; i< inputElementNodeList.length; i++){
        let curEle = inputElementNodeList[i];
        let dataBill = curEle.getAttribute(attribute);
        let value = parseInt(curEle.value);
        summation += (dataBill * value);
    }
    return summation;
}

function calculateWithdrawAmount(withdrawal,balance){
    let max = Math.floor(balance * 0.2);
    if(withdrawal > max){
        return max;
    }
    else{
        return withdrawal
    }
}

function displayNone(ele){
    ele.classList.add(`d-none`);
}
function resetPage(ele){
    if(ele.classList.contains(`d-none`) == false){
        ele.classList.add(`d-none`)
    }
    ele.innerHTML = ``;
};

function removeDisplayNone(ele){
    ele.classList.remove(`d-none`);
};
