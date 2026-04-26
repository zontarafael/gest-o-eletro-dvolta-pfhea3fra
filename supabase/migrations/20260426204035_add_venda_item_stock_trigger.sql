-- Create function to handle stock updates based on venda_itens
CREATE OR REPLACE FUNCTION public.handle_venda_item_stock()
RETURNS trigger AS $$
BEGIN
  -- Se for INSERT, deduz do estoque
  IF TG_OP = 'INSERT' THEN
    IF NEW.produto_id IS NOT NULL THEN
      UPDATE public.produtos
      SET quantidade = COALESCE(quantidade, 0) - NEW.quantidade
      WHERE id = NEW.produto_id;
    END IF;
    RETURN NEW;
  -- Se for DELETE, volta para o estoque
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.produto_id IS NOT NULL THEN
      UPDATE public.produtos
      SET quantidade = COALESCE(quantidade, 0) + OLD.quantidade
      WHERE id = OLD.produto_id;
    END IF;
    RETURN OLD;
  -- Se for UPDATE, ajusta a diferença
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.produto_id = NEW.produto_id AND NEW.produto_id IS NOT NULL THEN
      UPDATE public.produtos
      SET quantidade = COALESCE(quantidade, 0) + OLD.quantidade - NEW.quantidade
      WHERE id = NEW.produto_id;
    ELSIF OLD.produto_id != NEW.produto_id THEN
      IF OLD.produto_id IS NOT NULL THEN
        UPDATE public.produtos
        SET quantidade = COALESCE(quantidade, 0) + OLD.quantidade
        WHERE id = OLD.produto_id;
      END IF;
      IF NEW.produto_id IS NOT NULL THEN
        UPDATE public.produtos
        SET quantidade = COALESCE(quantidade, 0) - NEW.quantidade
        WHERE id = NEW.produto_id;
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_venda_item_change ON public.venda_itens;
CREATE TRIGGER on_venda_item_change
  AFTER INSERT OR UPDATE OR DELETE ON public.venda_itens
  FOR EACH ROW EXECUTE FUNCTION public.handle_venda_item_stock();
