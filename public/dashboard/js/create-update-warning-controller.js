
    const searchBox = document.getElementById('searchInputControl');
    const detailsContainer = document.getElementById('namad-details-container');
    const bidaskTable = document.getElementById('bidaskTable');
    const failedMessage = document.getElementById('failed-message');
    const compareField = document.getElementById('compare-field');
    const comparator = document.getElementById('comparator');
    const compareNumber = document.getElementById('compareNumber');
    const warningName = document.getElementById('warningName');
    const customCheck = document.getElementById('customCheck');

    customCheck.checked = true;
    warningName.setAttribute('readonly', true);

    searchBox.value && symbolDataRequest();

    searchBox.addEventListener('keyup', async (e) => {
        symbolDataRequest();
    });

    compareField.addEventListener('change', (e) => {
        if(e.target.value == 1 || e.target.value == 3) validatePercentFields(compareNumber.value);
        warnigNameCompleter();
    })

    comparator.addEventListener('change', () => {
        warnigNameCompleter();
    })

    customCheck.addEventListener('change', (e) => {
        if(e.target.checked) {
            warnigNameCompleter();
            warningName.setAttribute('readonly', true);
        } else {
            warningName.value = '';
            warningName.removeAttribute('readonly');
        }
    })

    compareNumber.addEventListener('keyup', (e) => {
        let reg = /^-?\d*\.?\d*$/;

        if(reg.test(e.target.value)) warnigNameCompleter();
            else {
                e.target.value = '';
                customCheck.checked && warnigNameCompleter();
                Swal.fire({
                    title: 'لطفا فقط مقدار عددی را وارد این قسمت بکنید.',
                    type: 'error',
                    position: 'top-right',
                    toast: true,
                    showConfirmButton: false,
                    timer: 5000
                })
            }

        if(compareField.value == 1 || compareField.value == 3) validatePercentFields(e.target.value);
    });

    warnigNameCompleter();

    function warnigNameCompleter() {
        if (customCheck.checked) {
            warningName.value = 
                `${compareField.options[compareField.selectedIndex].text.trim()} ${comparator.options[comparator.selectedIndex].text.trim()} ${compareNumber.value || 0}`;
        }
    }
    
    function symbolDataRequest() {
        $.ajax({
            url: '/warnings/namadSearch',
            data: { name: searchBox.value },
            method: 'POST',
            success: (data) => {
                failedMessage.style.display = 'none';
                detailsContainer.style.display = 'block';
                bidaskTable.style.display = 'block';
                bidaskTable.style.background = detailsContainer.style.background = 'aliceblue';
                bidaskTable.style.borderRadius = detailsContainer.style.borderRadius = '20px';
                detailsContainer.classList.add('my-4');

                detailsContainer.innerHTML = `
                    <div class="d-flex align-items-center p-2">
                        <div class="flex-grow-1">
                            <h6 class="mb-0 mr-2">${data.name}</h6>
                            <small class="text-muted mr-2">${data.data.desc}</small>
                        </div>
                        <div dir="ltr" class="h6 text-end mb-0">
                            <span> ${data.data.dealingPrice} </span>
                            <small class="${parseFloat(fixNumbers(data.data.dealingPricePercent)) >= 0 ? 'text-success' : 'text-danger'}"> (${data.data.dealingPricePercent}) </small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between p-2 border-top">
                        <div class="no-wrap">
                            <span class="text-muted">قیمت پایانی:</span>
                            <span dir="ltr" class="${parseFloat(fixNumbers(data.data.lastPricePercent)) >= 0 ? 'text-success' : 'text-danger'}"> (${data.data.lastPricePercent})
                            </span>
                            ${data.data.lastPrice}
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="text-muted ml-1">حجم:</span>
                            <span dir="ltr" class="d-block">${data.data.hajmMoamelat} M</span>
                        </div>
                    </div>
                `;

                bidaskTable.innerHTML = `
                    <div class="d-flex align-items-center justify-content-between p-2">
                        <div class="flex-grow-1 text-center">
                            <h6>جدول خرید و فروش</h6>
                            ${data.data.bidaskTable}
                        </div>
                    </div>
                `
                    ;
            },
            error: (req, status, error) => {
                detailsContainer.style.display = 'none';
                bidaskTable.style.display = 'none';
                failedMessage.style.display = 'flex';

                failedMessage.innerHTML = `<span class="badge badge-danger p-2 my-3">${req.responseText}</span>`
            }
        });
    }

    function fixNumbers(str) {
        const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
            arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

        const replacePercent = str.replace('٪', '');
        let convertedStr = replacePercent.replace('٫', '.');

        if (typeof convertedStr === 'string') {
            for (var i = 0; i < 10; i++) {
                convertedStr = convertedStr.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
            }
        }

        return convertedStr;
    };

function validatePercentFields(value) {
    if(parseFloat(value) >= 10 || parseFloat(value) <= -10) {
        compareNumber.value = '';
        warnigNameCompleter();
        Swal.fire({
            title: 'با توجه به شرطی که شما تعیین کردید. مقدار این فیلد فقط میتواند بین 10- تا 10 باشد.',
            type: 'error',
            position: 'top-right',
            toast: true,
            showConfirmButton: false,
            timer: 7000
        })
    }
}