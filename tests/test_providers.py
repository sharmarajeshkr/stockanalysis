import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
from data.providers import YFinanceProvider

class TestYFinanceProvider(unittest.TestCase):
    def setUp(self):
        self.provider = YFinanceProvider()

    @patch('data.providers.yf.download')
    def test_get_history_success(self, mock_download):
        # Setup mock return value
        mock_data = pd.DataFrame({
            'Open': [100.0, 101.0],
            'High': [105.0, 106.0],
            'Low': [95.0, 96.0],
            'Close': [102.0, 103.0],
            'Volume': [1000, 2000]
        }, index=pd.to_datetime(['2023-01-01', '2023-01-02']))
        mock_download.return_value = mock_data

        # Call method
        result = self.provider.get_history('TEST', '2023-01-01')

        # Assertions
        mock_download.assert_called_once()
        pd.testing.assert_frame_equal(result, mock_data)

    @patch('data.providers.yf.download')
    def test_get_history_empty(self, mock_download):
        # Setup mock return value for empty result
        mock_download.return_value = pd.DataFrame()

        # Call method
        result = self.provider.get_history('TEST', '2023-01-01')

        # Assertions
        self.assertTrue(result.empty)

    @patch('data.providers.yf.download')
    def test_get_history_error(self, mock_download):
        # Setup mock to raise exception
        mock_download.side_effect = Exception("Network error")

        # Assertions
        with self.assertRaises(Exception):
            self.provider.get_history('TEST', '2023-01-01')

if __name__ == '__main__':
    unittest.main()
