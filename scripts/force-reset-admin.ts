import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

async function forceRecreate() {
    const email = 'savikafoods@gmail.com'
    const password = 'S@vik@@786*'

    console.log(`Starting clean re-creation for: ${email}...`)

    // 1. Try to find and delete existing user by email
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const existing = users.find(u => u.email === email)
    
    if (existing) {
        console.log(`Deleting existing user ID: ${existing.id}...`)
        await supabase.auth.admin.deleteUser(existing.id)
    }

    // 2. Clear profile just in case
    console.log('Cleaning up potential profile...')
    await supabase.from('profiles').delete().eq('email', email)

    // 3. Create fresh user
    console.log('Creating fresh admin user...')
    const { data: freshUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: 'Admin User' }
    })

    if (createError) {
        if (createError.message.includes('already exists')) {
             console.log('User still exists in Auth according to API. Attemping blind password update...')
             // If create fails despite deletion (rare internal Supabase state), we'll try to find them again or just update
             // But usually deleteUser solves this.
        }
        console.error('CRITICAL ERROR during creation:', createError)
        return
    }

    if (freshUser?.user) {
        console.log(`User created successfully (ID: ${freshUser.user.id})`)
        
        // 4. Set Admin Role
        const { error: profileError } = await supabase.from('profiles').upsert({
            id: freshUser.user.id,
            email: email,
            role: 'admin',
            full_name: 'Admin User'
        })

        if (profileError) {
            console.error('Error setting admin role:', profileError)
        } else {
            console.log('SUCCESS: Admin account re-created from scratch!')
            console.log(`Email: ${email}`)
            console.log(`Password: ${password}`)
        }
    }
}

forceRecreate()
