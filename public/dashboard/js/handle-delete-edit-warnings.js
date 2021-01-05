let event;
let id;

function editWarning(recievedID, e) {
  id = recievedID;
  event = e;
  $("#showModal").click();
}

function deleteWarning(id) {
  $.ajax({
    url: "/warnings/deleteWarning",
    method: "POST",
    data: { id },
    success: (data) => {
      const { warning, warningsLength } = data;

      $(`#${warning._id}`).remove();

      if (warningsLength == 0) {
        $("#data-table-container").remove();
        $("#no-warning-alert").removeAttr("hidden");
        $("#no-warning-alert").append(`
            <div class="row d-flex justify-content-center" style="height: 76%;width: 106%;align-items: center;vertical-align: middle;">
                <h3 class="text-dark px-5">شما هشداری را برای خود ایجاد نکرده اید. پس از ایجاد، هشدارهای شما در اینجا به نمایش در آورده میشوند.</h3>
            </div>
        `);
      }

      Swal.fire({
        title: "هشدار شما با موفقیت حذف شد.",
        type: "success",
        position: "center",
        toast: true,
        showConfirmButton: false,
        timer: 4000,
      });
    },
  });
}

$(document).ready(function ($) {
  $("#showModal").on("click", async function (event) {
    $.ajax({
      url: "/warnings/editWarning",
      method: "POST",
      data: { id },
      success: (data) => {
        $("#searchInputControl").val(data.symbolName);
        $("#compareNumber").val(data.compareNumber);
        $("#compare-field").val(data.compareField);
        $("#comparator").val(data.comparator);
        $("#warningName").val(data.warningName);
        $("#update-warning-form").attr(
          "action",
          `/warnings/updateWarning/${data._id}`
        );

        symbolDataRequest();

        $("#modal").modal("show");
      },
    });
  });
});
