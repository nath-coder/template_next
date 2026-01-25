const headers={
                'Content-Type':'application/json',
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NzViZTQ3NjFjYzI2MzJhOWQxZDc4ZSIsImVtYWlsIjoiZGlhbmFAZ21haWwuY29tIiwibmFtZSI6IkRpYW5hUHJpbmNlIiwiaWF0IjoxNzY5MzI0MjAxfQ.Rr8QTcPvZguQOyVXdy_Z-z6wSUBMnZ3WdzBzoA5kcUU`
            };

export const fetchCardData= async()=>{
    try{
        const [getCustomerCount,getInvoicesCount,getInvoicesStatusCount]= await Promise.all([
             fetch(`${process.env.BACKEND_URL}/customer/count`,{headers}),
             fetch(`${process.env.BACKEND_URL}/invoices/count`,{headers}),
             fetch(`${process.env.BACKEND_URL}/invoices/status-count`,{headers})
        ])
        const resultCustomerCount= await getCustomerCount.json();
        const resultInvoicesCount= await getInvoicesCount.json();
        const resultInvoicesStatusCount= await getInvoicesStatusCount.json();

        const numberOfInvoices= Number(resultInvoicesCount ?? '0');
        const numberOfCustomers= Number (resultCustomerCount ?? '0');
        const totalPaidInvoices= resultInvoicesStatusCount.paid ?? 0;
        const totalPendingInvoices= resultInvoicesStatusCount.pending ?? 0;
        return [
            numberOfInvoices,
            numberOfCustomers,
            totalPaidInvoices,
            totalPendingInvoices
        ];
    }catch(error){
        console.log('Error :>>',error);
        throw new Error('Failed to fetch card data');
    }
}