import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { FilterMatchMode } from 'primereact/api';
import '../../index.css';
import '../../flags.css';
import ReactDOM from 'react-dom';

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CustomerService } from './FoodService';

const DataTableLazyDemo = () => {

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [foods, setFoods] = useState(null);
    const [tableFilters, setTableFilters] = useState(null);
    const [tableParams, setTableParams] = useState({
        page: 0,
        length: 10,
        first: 0
    })
    const [lazyParams, setLazyParams] = useState({
        length: 10,
        page: 0,
        dtSearch: {
            'name': { value: '', matchMode: 'contains' },
        }
    });

    const customerService = new CustomerService();

    let loadLazyTimeout = null;

    useEffect(() => {
        loadLazyData();
    },[lazyParams]) // eslint-disable-line react-hooks/exhaustive-deps

    const loadLazyData = ( _param ?) => {
        setLoading(true);

        if (loadLazyTimeout) {
            clearTimeout(loadLazyTimeout);
        }

        //imitate delay of a backend call
        loadLazyTimeout = setTimeout(() => {
            customerService.getFoods({ lazyEvent: JSON.stringify( _param ?? lazyParams) }).then(data => {
                setTotalRecords(data.totalElements);
                setFoods(data.content);
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    }

    const onPage = (event) => {
        setLazyParams(event);
    }

    const onSort = (event) => {
        setLazyParams(event);
    }

    const onFilter = (_filter) => {
        /** set the filter's default values */
      
        const nameValue = _filter.filters['name']?.value
        const nameMMode = _filter.filters['name']?.matchMode

        const lazyEvent = {
            length: 10,
            page: 0,
            dtSearch: {
                name: { value: nameValue || '', matchMode: FilterMatchMode.CONTAINS, type: "string" },
            }
        }
        loadLazyData(lazyEvent);
    }



    return (
        <div>
            <div className="card">
                <DataTable value={foods} lazy 
                    filterDisplay="row" 
                    responsiveLayout="scroll" dataKey="id"
                    paginator  rows={10} totalRecords={totalRecords}
                    filters={tableFilters}
                    onFilter={onFilter}  
                    loading={loading}
                    onSort={onSort} 
                    >
                    <Column field="name" header="Name"  filter  filterField='name' filterPlaceholder="Search by name" />
                </DataTable>
            </div>
        </div>
    );
}
                
export default DataTableLazyDemo;