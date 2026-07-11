import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env vars. Check .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── AUTH ──────────────────────────────────
export const signUp = (email, password) =>
  supabase.auth.signUp({ email, password })

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ── PROFILES ──────────────────────────────
export const createProfile = (userId, data) =>
  supabase.from('profiles').insert([{ user_id: userId, ...data }]).select()

export const getProfile = (userId) =>
  supabase.from('profiles').select('*').eq('user_id', userId).single()

export const getProfileByUsername = (username) =>
  supabase.from('profiles').select('*').eq('username', username).single()

export const updateProfile = (userId, data) =>
  supabase.from('profiles').update({ ...data, updated_at: new Date() }).eq('user_id', userId).select()

export const searchUsers = (q) =>
  supabase.from('profiles')
    .select('id, user_id, username, full_name, avatar_url, role, trust_score, is_verified')
    .or(`username.ilike.%${q}%,full_name.ilike.%${q}%`)
    .limit(12)

export const getAllProfiles = (limit = 20) =>
  supabase.from('profiles')
    .select('id, user_id, username, full_name, avatar_url, role, trust_score, is_verified, location')
    .order('trust_score', { ascending: false })
    .limit(limit)

// ── PROJECTS ──────────────────────────────
export const createProject = (userId, data) =>
  supabase.from('projects').insert([{ user_id: userId, ...data }]).select()

export const getProject = async (id) => {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
  if (error || !data) return { data: null, error }
  const { data: prof } = await supabase
    .from('profiles')
    .select('username, avatar_url, full_name')
    .eq('user_id', data.user_id)
    .maybeSingle()
  return { data: { ...data, profiles: prof || null }, error: null }
}

export const getUserProjects = (userId) =>
  supabase.from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: false })

export const getAllProjects = async (limit = 24) => {
  const { data, error } = await supabase.from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error || !data) return { data: [], error }
  const ids = [...new Set(data.map(p => p.user_id))]
  const { data: profs } = await supabase
    .from('profiles')
    .select('user_id, username, avatar_url, full_name')
    .in('user_id', ids)
  const map = Object.fromEntries((profs || []).map(p => [p.user_id, p]))
  return { data: data.map(p => ({ ...p, profiles: map[p.user_id] || null })), error: null }
}

export const updateProject = (id, data) =>
  supabase.from('projects').update({ ...data, updated_at: new Date() }).eq('id', id).select()

export const deleteProject = (id) =>
  supabase.from('projects').delete().eq('id', id)

// ── SKILLS ────────────────────────────────
export const getAllSkills = () =>
  supabase.from('skills').select('*').order('category')

export const getUserSkills = (userId) =>
  supabase.from('user_skills').select('*, skills(name, category)').eq('user_id', userId)

export const addSkill = (userId, skillId) =>
  supabase.from('user_skills').insert([{ user_id: userId, skill_id: skillId }])

export const removeSkill = (userId, skillId) =>
  supabase.from('user_skills').delete().eq('user_id', userId).eq('skill_id', skillId)

// ── CONNECTIONS ───────────────────────────
export const follow = (followerId, followingId) =>
  supabase.from('connections').insert([{ follower_id: followerId, following_id: followingId }])

export const unfollow = (followerId, followingId) =>
  supabase.from('connections').delete().eq('follower_id', followerId).eq('following_id', followingId)

export const isFollowing = async (followerId, followingId) => {
  const { data } = await supabase.from('connections')
    .select('id').eq('follower_id', followerId).eq('following_id', followingId).single()
  return !!data
}

export const getFollowerCount = async (userId) => {
  const { count } = await supabase.from('connections')
    .select('*', { count: 'exact', head: true }).eq('following_id', userId)
  return count || 0
}

export const getFollowingCount = async (userId) => {
  const { count } = await supabase.from('connections')
    .select('*', { count: 'exact', head: true }).eq('follower_id', userId)
  return count || 0
}

// ── LIKES ─────────────────────────────────
export const likeProject = (userId, projectId) =>
  supabase.from('project_likes').insert([{ user_id: userId, project_id: projectId }])

export const unlikeProject = (userId, projectId) =>
  supabase.from('project_likes').delete().eq('user_id', userId).eq('project_id', projectId)

export const hasLiked = async (userId, projectId) => {
  const { data } = await supabase.from('project_likes')
    .select('id').eq('user_id', userId).eq('project_id', projectId).single()
  return !!data
}
