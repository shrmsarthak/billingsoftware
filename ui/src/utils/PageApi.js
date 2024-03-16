export const api_new_invoice = (options) => {
  window.open(
    "/sales/invoice/new",
    "_blank",
    "top=0,left=0,frame=true,nodeIntegration=true,contextIsolation=false,title=Invoice"
  );
};
export const api_show_invoice = (options) => {
  window.open(
    "/sales/invoice/show",
    "_blank",
    "top=0,left=0,frame=true,nodeIntegration=true,contextIsolation=false,title=Invoice"
  );
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
