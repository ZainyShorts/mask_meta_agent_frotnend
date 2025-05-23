'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import toast, { Toaster } from 'react-hot-toast'

import type { ThemeColor } from '@core/types'

import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

import type { ButtonProps } from '@mui/material/Button'

import tableStyles from '@core/styles/table.module.css'
import { deleteRestaurant, getAllResturants } from '@/api/resturant'
import type { ResturantsType } from '@/types/apps/restoTypes'
import AddRestoDrawer from './AddRestoDrawer'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import { useAuthStore } from '@/store/authStore'
import EditResturantInfo from '@/components/dialogs/edit-resturant-info'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { useTheme } from '@mui/material/styles'
import AddOutletForm from '@/components/dialogs/add-outlet-form'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type RestorauntsTypeWithAction = ResturantsType & {
  action?: string
}

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank
  })

  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

// Column Definitions
const columnHelper = createColumnHelper<RestorauntsTypeWithAction>()

const RestoListTable = ({ tableData }: { tableData?: ResturantsType[] }) => {
  const router = useRouter()
  const theme = useTheme()

  const { lang: locale } = useParams()

  const [rowSelection, setRowSelection] = useState({})
  const [deleteResturantOpen, setDeleteResturantOpen] = useState(false)
  const { resturantData, resturantAction } = useAuthStore()
  const [editRestoFlag, setEditRestoFlag] = useState<boolean>(false)

  const [data, setData] = useState<ResturantsType[]>(tableData || [])
  const [globalFilter, setGlobalFilter] = useState('')

  const fetchResturants = async () => {
    try {
      const response = await getAllResturants()

      setData(response?.data?.results || [])
      resturantAction(response?.data?.results)
    } catch (err: any) {
      // setError(err.message || 'Failed to fetch users')
    } finally {
      // setLoading(false)
    }
  }

  useEffect(() => {
    fetchResturants()
  }, [deleteResturantOpen, editRestoFlag])

  const handleTypeAdded = () => {
    fetchResturants()
    setEditRestoFlag(true)
  }

  const handleDeleteResturant = (id: number, e: any) => {
    e.preventDefault()

    deleteRestaurant(id.toString())
      .then(res => {
        console.log(res, 'Resturant deleted')
        toast.success('Outlet deleted successfully')
        setDeleteResturantOpen(true)
        // router.replace('/home') // Optionally, redirect or refresh the page
      })
      .catch(error => {
        console.log(error, 'error in deleting Outlet')

        if (error?.data && error?.data?.detail) {
          toast.error(error?.data?.detail)
        } else {
          toast.error('Error in deleting Outlet')
        }
      })
  }

  const columns = useMemo<ColumnDef<RestorauntsTypeWithAction, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('id', {
        header: '#',
        cell: ({ row }) => (
          <Typography
            component={Link}
            href={getLocalizedUrl(`/resturants/${row.original.id}`, locale as Locale)}
            color='primary'
          >{`${row.original.id}`}</Typography>
        )
      }),

      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.name}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('city', {
        header: 'City',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.city}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('postal_code_delivery', {
        header: 'Postal Code Delivery',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row?.original?.postal_code_delivery}
          </Typography>
        )
      }),
      columnHelper.accessor('contact_number', {
        header: 'Contact Number',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row?.original?.contact_number}
          </Typography>
        )
      }),
      columnHelper.accessor('business.business_id', {
        header: 'business Id',
        cell: ({ row }) => <Typography>{row?.original?.business.business_id}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={e => handleDeleteResturant(row?.original?.id, e)}>
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
            <div className='flex gap-4 justify-center'>
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps('Edit', 'primary', 'contained')}
                dialog={EditResturantInfo}
                onTypeAdded={handleTypeAdded}
                dialogProps={{
                  data: resturantData.find((item: any) => item.id === row?.original?.id)
                }}
              />
            </div>
          </div>
        ),
        enableSorting: false
      })
    ],
    [data]
  )

  const table = useReactTable({
    data: data as ResturantsType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      <Card>
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Add Outlet', 'primary', 'contained')}
              dialog={AddOutletForm}
              onTypeAdded={handleTypeAdded}
              dialogProps={
                {
                  // data: menuData.find((item: any) => item.id === row.original.id)
                }
              }
            />
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='tabler-chevron-up text-xl' />,
                            desc: <i className='tabler-chevron-down text-xl' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getFilteredRowModel().rows?.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns()?.length} className='text-center'>
                    No data available
                  </td>
                </tr>
              ) : (
                table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel()?.rows?.length ?? 0}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
    </>
  )
}

export default RestoListTable
