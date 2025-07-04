"use client"

import type React from "react"
import { useEffect, useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// MUI Imports
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import TablePagination from "@mui/material/TablePagination"
import type { TextFieldProps } from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"

// Third-party Imports
import classnames from "classnames"
import { rankItem } from "@tanstack/match-sorter-utils"
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
  getSortedRowModel,
} from "@tanstack/react-table"
import type { ColumnDef, FilterFn } from "@tanstack/react-table"
import type { RankingInfo } from "@tanstack/match-sorter-utils"

// Type Imports
import toast from "react-hot-toast"
import type { ThemeColor } from "@core/types"
import TablePaginationComponent from "@components/TablePaginationComponent"
import CustomTextField from "@core/components/mui/TextField"
import tableStyles from "@core/styles/table.module.css"
import type { MenuesType } from "@/types/apps/menuTypes"
import EditMenuInfo from "@/components/dialogs/edit-menu-info"
import OpenDialogOnElementClick from "@/components/dialogs/OpenDialogOnElementClick"
import type { ButtonProps } from "@mui/material/Button"
import { useAuthStore } from "@/store/authStore"
import type { BusinessType } from "@/types/apps/businessTypes"
import { getAllBusiness } from "@/api/business"
import { createTemplate, createFlow, deleteMenu, getAllMenuesByBusinessId, syncMenuData } from "@/api/menu"
import { getLocalizedUrl } from "@/utils/i18n"
import type { Locale } from "@/configs/i18n"
import AddtMenuForm from "@/components/dialogs/add-menu-form"
import ConfirmationDialog from "@/components/ConfirmationDialog"
import ConfirmationModal from "@/components/dialogs/confirm-modal"
import { ENDPOINTS, getBaseUrl } from "@/api/vars/vars"
import CSVImportModal from "@/components/dialogs/csv-import-modal"

// Extend react-table with custom filter functions
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type MenuesTypeWithAction = MenuesType & {
  action?: string
}

// Custom fuzzy filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank,
  })
  return itemRank.passed
}

// Debounced input component for search
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, "onChange">) => {
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

  return <CustomTextField {...props} value={value} onChange={(e) => setValue(e.target.value)} />
}

// Helper function for button props
const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps["variant"]): ButtonProps => ({
  children,
  color,
  variant,
})

// Column Definitions using react-table's column helper
const columnHelper = createColumnHelper<MenuesTypeWithAction>()

const MenuListTable = ({ tableData }: { tableData?: MenuesType[] }) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [rowSelection, setRowSelection] = useState({})
  const [loading, setLoading] = useState<boolean>(false)
  const { menuData, menuAction, user } = useAuthStore()
  const [userBuinsessData, setUserBusinessesData] = useState<BusinessType[]>([])

  // State variables for business selection and data filtering
  const [selectedBusiness, setSelectedBusiness] = useState<string | number>("")
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | number>("")
  const [data, setData] = useState<MenuesType[]>(tableData || [])
  const [globalFilter, setGlobalFilter] = useState("")

  // Modal states
  const [editMenuFlag, setEditMenuFlag] = useState<boolean>(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)
  const [csvImportOpen, setCsvImportOpen] = useState(false)

  // Memoized fetch functions to prevent unnecessary re-renders
  const fetchMenuesForBusiness = useCallback(
    async (businessId: string | number) => {
      if (!businessId) return

      try {
        // Assuming the API supports filtering by business_id
        // If not, you may need to modify the API endpoint
        console.log('businessId',businessId)
        const response = await getAllMenuesByBusinessId(businessId.toString())
        const menus = response || []
        console.log(menus)
        setData(menus) // Directly set filtered data
        menuAction(menus)
      } catch (err: any) {
        console.error("Error fetching menus:", err)
        toast.error(err.message || "Failed to fetch menus")
      }
    },
    [menuAction],
  )

  const fetchBusiness = useCallback(async () => {
    try {
      const response = await getAllBusiness()
      const businesses = response?.data?.results || []
      setUserBusinessesData(businesses)
      // Remove auto-selection of first business
      // User must manually select a business
    } catch (err: any) {
      // toast.error(err.message || "Failed to fetch businesses")
      console.log(err.message)
    }
  }, [])

  // Initial data fetch - only on component mount
  useEffect(() => {
    fetchBusiness()
  }, [fetchBusiness])

  // Update the business selection effect to only fetch when business is selected
  useEffect(() => {
    if (selectedBusiness) {
      fetchMenuesForBusiness(selectedBusiness)
    } else {
      // Clear data when no business is selected
      setData([])
    }
  }, [selectedBusiness, fetchMenuesForBusiness])

  // Optimized handler that doesn't trigger unnecessary re-fetches
  const handleTypeAdded = useCallback(() => {
    if (selectedBusiness) {
      fetchMenuesForBusiness(selectedBusiness)
    }
  }, [fetchMenuesForBusiness, selectedBusiness])

  const handleBusinessChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedBusinessValue = event.target.value
      const selectedBusinessDetails = userBuinsessData.find(
        (business) => Number(business.id) === Number(selectedBusinessValue),
      )
      setSelectedBusiness(selectedBusinessValue)
      setSelectedBusinessId(selectedBusinessDetails?.business_id || "")
    },
    [userBuinsessData],
  )

  // Handler for deleting a menu - optimized to only refetch on success
  const handleDeleteMenu = useCallback(
    async (id: number) => {
      if (!selectedBusiness) {
        toast.error("Please select a business first")
        return
      }

      try {
        await deleteMenu(id)
        toast.success("Menu deleted successfully")
        fetchMenuesForBusiness(selectedBusiness)
        setIsModalOpen(false)
        setSelectedMenuId(null)
      } catch (error: any) {
        if (error?.data && error?.data?.detail) {
          toast.error(error?.data?.detail)
        } else {
          toast.error("Error in deleting menu")
        }
      }
    },
    [selectedBusiness, fetchMenuesForBusiness],
  )

  const handleAddToppings = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      router.replace(getLocalizedUrl(`/menu/combination/${selectedBusinessId}`, locale as Locale))
    },
    [router, selectedBusinessId, locale],
  )

  const handleAddSize = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      router.replace(getLocalizedUrl(`/menu/size/${selectedBusinessId}`, locale as Locale))
    },
    [router, selectedBusinessId, locale],
  )

  // Enhanced CSV Import handler with preview data
  const handleCSVImport = useCallback(
    async (file: File, csvData: any) => {
      if (!selectedBusiness) {
        toast.error("Please select a business first")
        return
      }

      try {
        const authToken = localStorage.getItem("auth_token")
        if (!authToken) {
          toast.error("Authentication token not found. Please login again.")
          return
        }

        const formData: any = new FormData()
        formData.append("file", file)
        formData.append("businessId", selectedBusiness)

        toast.loading("Importing CSV data...", { id: "csv-import" })

        const response = await fetch(`${getBaseUrl()}whatseat/${ENDPOINTS.import_csv}/`, {
          method: "POST",
          headers: {
            Authorization: `Token ${authToken}`,
          },
          body: formData,
        })

        const result = await response.json()

        if (result.success) {
          toast.success(result.msg, {
            id: "csv-import",
          })
          // handleConfirm() // sync to meta
          fetchMenuesForBusiness(selectedBusiness)
        } else {
          toast.error(result.msg || "Failed to import CSV data", {
            id: "csv-import",
          })
        }
      } catch (error: any) {
        console.error("CSV Import Error:", error)
        toast.error("Network error occurred while importing CSV", {
          id: "csv-import",
        })
      }
    },
    [selectedBusiness, fetchMenuesForBusiness],
  )

  const handleCreateFlow = useCallback(
    (menuItems: any) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (!selectedBusiness) {
        toast.error("Please select a business first")
        return
      }

      const payload = {
        name: `${menuItems.sku}_${menuItems.type.name}_flow2`,
        categories: ["OTHER"],
        flow_type: "toppings",
        type_id: menuItems.type.id,
        menu_id: menuItems.id,
        business_id: selectedBusiness,
      }

      createFlow(payload)
        .then((res) => {
          console.log(res, "Create Address Flow")
          toast.success("Flow Created Successfully")
          fetchMenuesForBusiness(selectedBusiness)
        })
        .catch((error) => {
          console.log(error, "error in creating Address Flow")
          toast.error(error?.data?.error)
        })
    },
    [selectedBusiness, fetchMenuesForBusiness],
  )

  const handleCreateTemplate = useCallback(
    (menuItems: any) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (!selectedBusiness) {
        toast.error("Please select a business first")
        return
      }

      const payload = {
        name: `${menuItems.sku}_template1`,
        category: "MARKETING",
        allow_category_change: true,
        language: "en",
        components: [
          {
            type: "BODY",
            text: `Please choose your preferred combination and the size for ${menuItems.type.name}`,
          },
          {
            type: "BUTTONS",
            buttons: [
              {
                type: "FLOW",
                text: `Create your  ${menuItems.type.name}`,
                flow_id:
                  menuItems.facebook_flows && menuItems.facebook_flows.length > 0
                    ? menuItems.facebook_flows[0].flow_id
                    : "89898",
              },
            ],
          },
        ],
        business_id: selectedBusiness,
        flow_id:
          menuItems.facebook_flows && menuItems.facebook_flows.length > 0
            ? menuItems.facebook_flows[0].flow_id
            : "89898",
        menu_id: menuItems.id,
      }

      createTemplate(payload)
        .then((res) => {
          toast.success("Template Created Successfully", {
            duration: 5000,
          })
          fetchMenuesForBusiness(selectedBusiness)
        })
        .catch((error) => {
          toast.error(error?.data?.detail, {
            duration: 5000,
          })
        })
    },
    [selectedBusiness, fetchMenuesForBusiness],
  )

  const handleConfirm = useCallback(async () => {
    if (!selectedBusiness) {
      toast.error("Please select a business to sync.", {
        duration: 5000,
      })
      return
    }

    setLoading(true)
    const payload = {
      business_id: selectedBusiness,
    }

    try {
      await syncMenuData(payload)
      toast.success("Menu synced successfully", {
        duration: 5000,
      })
      setOpenConfirmation(false)
      fetchMenuesForBusiness(selectedBusiness)
    } catch (error: any) {
      toast.error(error?.data?.message, {
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }, [selectedBusiness, fetchMenuesForBusiness])

  const truncateText = useCallback((text: any, maxLength: any) => {
    if (!text) return ""
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }, [])

  // Define table columns - memoized to prevent unnecessary re-renders
  const columns = useMemo<ColumnDef<MenuesTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor("id", {
        header: "Catalouge Number",
        cell: ({ row }) => (
          <Typography
            component={Link}
            href={getLocalizedUrl(`/menu/${row.original.id}`, locale as Locale)}
            color="primary"
          >
            {`${row.original.menu_number}`}
          </Typography>
        ),
      }),
      columnHelper.accessor("title", {
        header: "Title",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {truncateText(row?.original?.title, 15)}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => <Typography>{row.original.status}</Typography>,
      }),
      columnHelper.accessor("sku", {
        header: "SKU",
        cell: ({ row }) => <Typography color="text.primary">{row.original.sku}</Typography>,
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: ({ row }) => (
          <Typography className="capitalize" color="text.primary">
            <strong>{row.original.price} {userBuinsessData[0].currency.code}</strong>
          </Typography>
        ),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <IconButton
              onClick={() => {
                setSelectedMenuId(row.original.id)
                setIsModalOpen(true)
              }}
            >
              <i className="tabler-trash text-[22px] text-textSecondary" />
            </IconButton>
            <div className="flex gap-4 justify-center">
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps("Edit", "primary", "contained")}
                dialog={EditMenuInfo}
                onTypeAdded={handleTypeAdded}
                dialogProps={{
                  data: menuData.find((item: any) => item.id === row.original.id),
                }}
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                variant="contained"
                disabled={row.original.flow || row.original.template}
                onClick={handleCreateFlow(row.original)}
              >
                Flow
              </Button>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                variant="contained"
                disabled={!row.original.flow || row.original.template}
                onClick={handleCreateTemplate(row.original)}
              >
                Template
              </Button>
            </div>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [handleDeleteMenu, menuData, handleTypeAdded, handleCreateFlow, handleCreateTemplate, truncateText, locale],
  )

  // Initialize react-table
  const table = useReactTable({
    data: data as MenuesType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
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
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => selectedMenuId !== null && handleDeleteMenu(selectedMenuId)}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action? This cannot be undone."
      />

      <CSVImportModal open={csvImportOpen} onClose={() => setCsvImportOpen(false)} onImport={handleCSVImport} />

      <Card>
        <div className="flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4">
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="is-[70px]"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </CustomTextField>

          <div className="flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4">
            Select Business
            <CustomTextField
              className="is-full sm:is-auto"
              select
              fullWidth
              id="business"
              value={selectedBusiness}
              onChange={handleBusinessChange}
              // displayEmpty
            >
              <MenuItem value="">
                <em>Select a business</em>
              </MenuItem>
              {userBuinsessData.length > 0 ? (
                userBuinsessData.map((user) => (
                  <MenuItem key={user.business_id} value={user.id}>
                    {user.business_id}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No businesses available
                </MenuItem>
              )}
            </CustomTextField>
            {user && Number(user?.user_type) !== 2 && (
              <>
                <OpenDialogOnElementClick
                  element={Button}
                  elementProps={buttonProps("Add Catalouge", "primary", "contained")}
                  dialog={AddtMenuForm}
                  onTypeAdded={handleTypeAdded}
                  dialogProps={{}}
                />

                <Button
                  variant="contained"
                  startIcon={<i className="tabler-upload" />}
                  onClick={() => setCsvImportOpen(true)}
                  className="is-full sm:is-auto"
                >
                  Import CSV
                </Button>

                <Button
                  variant="contained"
                  startIcon={<i className="tabler-plus" />}
                  onClick={handleAddToppings}
                  className="is-full sm:is-auto"
                >
                  Combination
                </Button>

                <Button
                  variant="contained"
                  startIcon={<i className="tabler-plus" />}
                  onClick={handleAddSize}
                  className="is-full sm:is-auto"
                >
                  Size
                </Button>

                <Button
                  variant="contained"
                  startIcon={<i className="tabler-upload" />}
                  className="is-full sm:is-auto"
                  onClick={() => setOpenConfirmation(true)}
                >
                  Sync Meta
                </Button>
              </>
            )}
          </div>
        </div>

        <ConfirmationDialog
          openConfirmation={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onConfirm={handleConfirm}
          title="Sync Meta"
          description="Syncing your menu with meta can take upto half an hour. Are you sure you want to Sync Meta?"
        />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            "flex items-center": header.column.getIsSorted(),
                            "cursor-pointer select-none": header.column.getCanSort(),
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className="tabler-chevron-up text-xl" />,
                            desc: <i className="tabler-chevron-down text-xl" />,
                          }[header.column.getIsSorted() as "asc" | "desc"] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {!selectedBusiness ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className="text-center py-8">
                    <Typography variant="h6" color="text.secondary">
                      Please select a business to view menu data
                    </Typography>
                  </td>
                </tr>
              ) : table.getFilteredRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className="text-center py-8">
                    <Typography variant="body1" color="text.secondary">
                      No menu data available for the selected business
                    </Typography>
                  </td>
                </tr>
              ) : (
                table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map((row) => (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
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

export default MenuListTable
