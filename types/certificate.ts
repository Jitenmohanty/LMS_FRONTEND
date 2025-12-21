export interface Certificate {
  _id: string
  certificateId: string
  issueDate: string
  completedAt: string
  user: string | {
    _id: string
    name: string
    email?: string
  }
  course: {
    _id: string
    title: string
    thumbnail?: string
  }
  pdfUrl?: string
}
