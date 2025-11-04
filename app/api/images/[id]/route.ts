import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

type Params = { params: { id: string } }

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const { error } = await supabase
      .from('generated_images')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


