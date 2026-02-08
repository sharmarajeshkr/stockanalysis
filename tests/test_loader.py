import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
from data.loader import get_stock_data

class TestLoader(unittest.TestCase):
    @patch('data.loader._provider')
    def test_get_stock_data_success(self, mock_provider):
        # Setup mock return value
        mock_data = pd.DataFrame({
            'Open': [100.0],
            'Close': [102.0]
        }, index=pd.to_datetime(['2023-01-01']))
        
        mock_provider.get_history.return_value = mock_data

        # Call method
        result = get_stock_data('TEST', '2023-01-01')

        # Assertions
        mock_provider.get_history.assert_called_once_with('TEST', '2023-01-01')
        pd.testing.assert_frame_equal(result, mock_data)

    @patch('data.loader._provider')
    def test_get_stock_data_no_data(self, mock_provider):
        # Setup mock return value for empty result
        mock_provider.get_history.return_value = pd.DataFrame()

        # Call method and expect ValueError
        with self.assertRaisesRegex(ValueError, "No data found for ticker TEST"):
            get_stock_data('TEST', '2023-01-01')

    @patch('data.loader._provider')
    def test_get_stock_data_provider_error(self, mock_provider):
         # Setup mock to raise exception
        mock_provider.get_history.side_effect = Exception("Provider failed")

        # Call method and expect generic exception
        with self.assertRaises(Exception):
            get_stock_data('TEST', '2023-01-01')

if __name__ == '__main__':
    unittest.main()
