export const api_new_invoice = (options) => {
  window.location.href = "/sales/invoice/new";
};
export const api_show_invoice = (options) => {
  window.location.href = "/sales/invoice/show";
};
export const api_new_quotation = (options) => {
  window.location.href = "/sales/quotation/new";
};
export const api_show_quotation = (options) => {
  window.location.href = "/sales/quotation/show";
};
export const api_show_ledger = (options) => {
  window.location.href = "/sales/ledger/show";
};
export const api_new_client = (options) => {
  window.open(
    "/sales/client/new",
    "_blank",
    "top=0,left=0,width=1600px,height=800,frame=true,nodeIntegration=true,contextIsolation=false,title=Invoice"
  );
};
export const api_new_product = (options) => {
  window.open(
    "/sales/product_service/new",
    "_blank",
    "top=0,left=0,width=1600px,height=800,frame=true,nodeIntegration=true,contextIsolation=false,title=Invoice"
  );
};
export const api_show_client = (options) => {
  window.open(
    "/sales/client/show",
    "_blank",
    "top=0,left=0,width=1600px,height=800,frame=true,nodeIntegration=true,contextIsolation=false,title=Invoice"
  );
};
export const api_show_product = (options) => {
  window.open(
    "/sales/product_service/show",
    "_blank",
    "top=0,left=0,width=1600px,height=800,frame=true,nodeIntegration=true,contextIsolation=false,title=Invoice"
  );
};

export const api_edit_client = (options) => {
  window.open(
    `/sales/client/edit/${options.id}`,
    "_blank",
    "top=0,left=0,width=1600px,height=800,frame=true,nodeIntegration=true,contextIsolation=false,title=Invoice"
  );
};
export const api_add_company = (options) => {
  window.location.href = "/settings/company/new";
};
export const api_add_debit = (options) => {
  window.location.href = "/sales/debit/new";
};
export const api_show_debit = (options) => {
  window.location.href = "/sales/debit/show";
};
export const api_add_credit = (options) => {
  window.location.href = "/sales/credit/new";
};
export const api_show_credit = (options) => {
  window.location.href = "/sales/credit/show";
};
export const api_new_payment = (options) => {
  window.location.href = "/sales/payment/new";
};
export const api_show_payment = (options) => {
  window.location.href = "/sales/payment/show";
};
export const api_new_purchase = (options) => {
  window.location.href = "/sales/purchase/new";
};
export const api_show_purchase = (options) => {
  window.location.href = "/sales/purchase/show";
};
