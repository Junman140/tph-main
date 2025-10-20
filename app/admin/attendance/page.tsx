"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MainNav } from "@/components/layout/main-nav"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Search, 
  Filter,
  Users,
  FileSpreadsheet,
  RefreshCw
} from "lucide-react"
import { format } from 'date-fns'

interface AttendanceRecord {
  id: string
  serviceDate: string
  serviceType: string
  memberName: string
  memberId?: string
  phoneNumber?: string
  email?: string
  address?: string
  age?: number
  gender?: string
  isVisitor: boolean
  isFirstTime: boolean
  notes?: string
  recordedBy?: string
  createdAt: string
}

const SERVICE_TYPES = [
  "Sunday Service",
  "Wednesday Service", 
  "Friday Service",
  "Special Event",
  "Youth Service",
  "Children's Service",
  "Prayer Meeting",
  "Bible Study",
  "Other"
]

const GENDER_OPTIONS = ["Male", "Female", "Other"]

export default function AttendanceManagementPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [serviceTypeFilter, setServiceTypeFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [visitorFilter, setVisitorFilter] = useState('')
  const [formData, setFormData] = useState({
    serviceDate: '',
    serviceType: '',
    memberName: '',
    memberId: '',
    phoneNumber: '',
    email: '',
    address: '',
    age: '',
    gender: '',
    isVisitor: false,
    isFirstTime: false,
    notes: '',
    recordedBy: ''
  })
  const router = useRouter()

  const fetchRecords = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('memberName', searchTerm)
      if (serviceTypeFilter) params.append('serviceType', serviceTypeFilter)
      if (dateFilter) params.append('serviceDate', dateFilter)
      if (visitorFilter) params.append('isVisitor', visitorFilter)

      const response = await fetch(`/api/attendance?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch attendance records')
      const data = await response.json()
      setRecords(data.records || data)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, serviceTypeFilter, dateFilter, visitorFilter])

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin')
    const adminToken = localStorage.getItem('adminToken')

    if (!adminData || !adminToken) {
      router.push('/admin/login')
      return
    }

    fetchRecords()
  }, [router, fetchRecords])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const url = editingRecord ? '/api/attendance' : '/api/attendance'
      const method = editingRecord ? 'PUT' : 'POST'
      
      const payload = {
        ...(editingRecord && { id: editingRecord.id }),
        serviceDate: formData.serviceDate,
        serviceType: formData.serviceType,
        memberName: formData.memberName,
        memberId: formData.memberId || null,
        phoneNumber: formData.phoneNumber || null,
        email: formData.email || null,
        address: formData.address || null,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        isVisitor: formData.isVisitor,
        isFirstTime: formData.isFirstTime,
        notes: formData.notes || null,
        recordedBy: formData.recordedBy || null,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save attendance record')
      }

      setSuccess(editingRecord ? 'Attendance record updated successfully!' : 'Attendance record created successfully!')
      setShowForm(false)
      setEditingRecord(null)
      resetForm()
      fetchRecords()
    } catch (error) {
      console.error('Form submission error:', error)
      setError((error as Error).message)
    }
  }

  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record)
    setFormData({
      serviceDate: new Date(record.serviceDate).toISOString().slice(0, 16),
      serviceType: record.serviceType,
      memberName: record.memberName,
      memberId: record.memberId || '',
      phoneNumber: record.phoneNumber || '',
      email: record.email || '',
      address: record.address || '',
      age: record.age?.toString() || '',
      gender: record.gender || '',
      isVisitor: record.isVisitor,
      isFirstTime: record.isFirstTime,
      notes: record.notes || '',
      recordedBy: record.recordedBy || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return

    try {
      const response = await fetch(`/api/attendance?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete attendance record')

      setSuccess('Attendance record deleted successfully!')
      fetchRecords()
    } catch (error) {
      setError((error as Error).message)
    }
  }

  const resetForm = () => {
    setFormData({
      serviceDate: '',
      serviceType: '',
      memberName: '',
      memberId: '',
      phoneNumber: '',
      email: '',
      address: '',
      age: '',
      gender: '',
      isVisitor: false,
      isFirstTime: false,
      notes: '',
      recordedBy: ''
    })
    setEditingRecord(null)
    setShowForm(false)
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Service Date', 'Service Type', 'Member Name', 'Member ID', 'Phone', 'Email', 'Address', 'Age', 'Gender', 'Visitor', 'First Time', 'Notes', 'Recorded By', 'Created At'],
      ...records.map(record => [
        format(new Date(record.serviceDate), 'yyyy-MM-dd'),
        record.serviceType,
        record.memberName,
        record.memberId || '',
        record.phoneNumber || '',
        record.email || '',
        record.address || '',
        record.age || '',
        record.gender || '',
        record.isVisitor ? 'Yes' : 'No',
        record.isFirstTime ? 'Yes' : 'No',
        record.notes || '',
        record.recordedBy || '',
        format(new Date(record.createdAt), 'yyyy-MM-dd HH:mm')
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance_records_${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const filteredRecords = records.filter(record => {
    const matchesSearch = !searchTerm || record.memberName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesServiceType = !serviceTypeFilter || serviceTypeFilter === 'all' || record.serviceType === serviceTypeFilter
    const matchesDate = !dateFilter || format(new Date(record.serviceDate), 'yyyy-MM-dd') === dateFilter
    const matchesVisitor = !visitorFilter || visitorFilter === 'all' || 
      (visitorFilter === 'true' && record.isVisitor) || 
      (visitorFilter === 'false' && !record.isVisitor)
    
    return matchesSearch && matchesServiceType && matchesDate && matchesVisitor
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg">Loading attendance records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Attendance Registry</h1>
              <p className="text-muted-foreground">Manage church attendance records</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={exportToCSV} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                  <Button onClick={() => { resetForm(); setEditingRecord(null) }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingRecord ? 'Edit Attendance Record' : 'Add New Attendance Record'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="serviceDate">Service Date *</Label>
                        <Input
                          id="serviceDate"
                          type="datetime-local"
                          value={formData.serviceDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, serviceDate: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serviceType">Service Type *</Label>
                        <Select value={formData.serviceType} onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICE_TYPES.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="memberName">Member Name *</Label>
                        <Input
                          id="memberName"
                          value={formData.memberName}
                          onChange={(e) => setFormData(prev => ({ ...prev, memberName: e.target.value }))}
                          required
                          placeholder="Enter member name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="memberId">Member ID</Label>
                        <Input
                          id="memberId"
                          value={formData.memberId}
                          onChange={(e) => setFormData(prev => ({ ...prev, memberId: e.target.value }))}
                          placeholder="Optional member ID"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                          placeholder="Enter age"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENDER_OPTIONS.map(gender => (
                              <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isVisitor"
                          checked={formData.isVisitor}
                          onChange={(e) => setFormData(prev => ({ ...prev, isVisitor: e.target.checked }))}
                          aria-label="Mark as visitor"
                        />
                        <Label htmlFor="isVisitor">Visitor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isFirstTime"
                          checked={formData.isFirstTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, isFirstTime: e.target.checked }))}
                          aria-label="Mark as first time visitor"
                        />
                        <Label htmlFor="isFirstTime">First Time</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional notes"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recordedBy">Recorded By</Label>
                      <Input
                        id="recordedBy"
                        value={formData.recordedBy}
                        onChange={(e) => setFormData(prev => ({ ...prev, recordedBy: e.target.value }))}
                        placeholder="Admin name"
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert>
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingRecord ? 'Update Record' : 'Add Record'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search by Name</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search member name..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      {SERVICE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFilter">Service Date</Label>
                  <Input
                    id="dateFilter"
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitorFilter">Visitor Status</Label>
                  <Select value={visitorFilter} onValueChange={setVisitorFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Visitors Only</SelectItem>
                      <SelectItem value="false">Members Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Records Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Attendance Records ({filteredRecords.length})
                </span>
                <Button onClick={fetchRecords} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Service Date</th>
                      <th className="text-left p-2 font-medium">Service Type</th>
                      <th className="text-left p-2 font-medium">Member Name</th>
                      <th className="text-left p-2 font-medium">Phone</th>
                      <th className="text-left p-2 font-medium">Email</th>
                      <th className="text-left p-2 font-medium">Age</th>
                      <th className="text-left p-2 font-medium">Gender</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 text-sm">
                          {format(new Date(record.serviceDate), 'MMM dd, yyyy')}
                        </td>
                        <td className="p-2 text-sm">{record.serviceType}</td>
                        <td className="p-2 text-sm font-medium">{record.memberName}</td>
                        <td className="p-2 text-sm">{record.phoneNumber || '-'}</td>
                        <td className="p-2 text-sm">{record.email || '-'}</td>
                        <td className="p-2 text-sm">{record.age || '-'}</td>
                        <td className="p-2 text-sm">{record.gender || '-'}</td>
                        <td className="p-2">
                          <div className="flex space-x-1">
                            {record.isVisitor && (
                              <Badge variant="secondary" className="text-xs">Visitor</Badge>
                            )}
                            {record.isFirstTime && (
                              <Badge variant="outline" className="text-xs">First Time</Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(record)}
                              title="Edit Record"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(record.id)}
                              title="Delete Record"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredRecords.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No attendance records found</h3>
                  <p className="text-muted-foreground">Add your first attendance record to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
