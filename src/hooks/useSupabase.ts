
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Categories hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

// Products hooks
export const useProducts = (page = 1, limit = 12, categoryFilter?: string) => {
  return useQuery({
    queryKey: ['products', page, limit, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (categoryFilter && categoryFilter !== 'All') {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('name', categoryFilter)
          .single();
        
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);
      
      if (error) throw error;
      return { products: data || [], count: count || 0 };
    },
  });
};

// Site settings hooks
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      const settings: Record<string, string> = {};
      data?.forEach(setting => {
        settings[setting.setting_key] = setting.setting_value;
      });
      
      return settings;
    },
  });
};

// Orders hooks
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: {
      customer_name: string;
      customer_phone: string;
      customer_email?: string;
      customer_address: string;
      order_items: any[];
      total_amount: number;
      delivery_charges: number;
    }) => {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been submitted. You'll be redirected to WhatsApp for confirmation.",
      });
    },
    onError: (error) => {
      console.error('Order creation error:', error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Reviews hooks
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewData: {
      product_id: string;
      customer_name: string;
      customer_email?: string;
      rating: number;
      review_text?: string;
    }) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', data.product_id] });
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
      });
    },
    onError: (error) => {
      console.error('Review creation error:', error);
      toast({
        title: "Review Failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      });
    },
  });
};
